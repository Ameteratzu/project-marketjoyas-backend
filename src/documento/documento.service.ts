import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { TipoDocumento, EstadoPedido } from '@prisma/client';

@Injectable()
export class DocumentoService {
  constructor(private readonly prisma: PrismaService) {}

  async crearDocumentoDesdePedido(
  pedidoId: number,
  user: JwtPayload,
) {
  // 1. Obtener pedido con productos, tienda y documento existente
  const pedido = await this.prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      productos: {
        include: {
          producto: true,
        },
      },
      tienda: true,
      documento: true,
    },
  });

  if (!pedido) {
    throw new NotFoundException('Pedido no encontrado');
  }

  if (pedido.tiendaId !== user.tiendaId) {
    throw new ForbiddenException('No puedes generar documentos para otra tienda');
  }

  if (pedido.documento) {
    throw new BadRequestException('Este pedido ya tiene un documento generado');
  }

  const estadosPermitidos: EstadoPedido[] = [
    EstadoPedido.PENDIENTE,
    EstadoPedido.EMPAQUETADO,
  ];
  if (!estadosPermitidos.includes(pedido.estado)) {
    throw new BadRequestException('Solo se puede generar boleta en estado PENDIENTE o EMPAQUETADO');
  }

  // 2. Definir tipo de documento (solo BOLETA por ahora)
  const tipoDocumento = TipoDocumento.BOLETA;

  // 3. Obtener serie correlativo activo
  const serieCorrelativo = await this.prisma.serieCorrelativo.findFirst({
    where: {
      tiendaId: pedido.tiendaId,
      tipoDocumento,
      activo: true,
    },
    orderBy: {
      creadoEn: 'asc',
    },
  });

  if (!serieCorrelativo) {
    throw new BadRequestException('No existe una serie activa para este tipo de documento');
  }

  const nuevoNumero = serieCorrelativo.ultimoNumero + 1;
  const numeroDocumento = `${serieCorrelativo.serie}-${String(nuevoNumero).padStart(6, '0')}`; // 6 dígitos

  // 4. Obtener cliente
  const cliente = await this.prisma.usuario.findUnique({
    where: { id: pedido.usuarioId },
  });

  if (!cliente) {
    throw new NotFoundException('Cliente del pedido no encontrado');
  }

  // 5. Preparar detalles del documento
  const items = pedido.productos.map((item) => {
    const precio = Number(item.producto.precio);
    if (isNaN(precio)) {
      throw new BadRequestException(`Producto "${item.producto.nombre}" no tiene precio válido`);
    }

    const cantidad = item.cantidad;
    const total = +(precio * cantidad).toFixed(2);

    return {
      productoNombre: item.producto.nombre,
      cantidad,
      precioUnitario: precio,
      total,
    };
  });

  // 6. Calcular totales
  const subtotal = +(items.reduce((acc, item) => acc + item.total, 0)).toFixed(2);
  const igv = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + igv).toFixed(2);

  const moneda = pedido.moneda ?? 'PEN';
  const tipoCambio = pedido.tipoCambio;

  if (moneda !== 'PEN' && !tipoCambio) {
    throw new BadRequestException('Debe haber tipo de cambio si la moneda no es PEN');
  }

  // 7. Transacción: crear documento, actualizar correlativo y pedido
  const [documento] = await this.prisma.$transaction([
    this.prisma.documento.create({
      data: {
        tipo: tipoDocumento,
        numero: numeroDocumento,
        serie: serieCorrelativo.serie,
        fechaEmision: new Date(),

        moneda,
        tipoCambio,

        formaPago: pedido.formaPago ?? 'CONTADO',
        condVenta: pedido.condVenta ?? null,

        subtotal,
        opGravado: subtotal,
        igv,
        total,

        // Snapshot cliente
        clienteNombre: cliente.nombre_completo ?? '',
        clienteDocumento: cliente.dni ?? '',
        clienteTelefono: cliente.telefono ?? null,
        clienteEmail: cliente.email ?? null,

        // Snapshot tienda
        tiendaNombre: pedido.tienda.nombre ?? 'SIN NOMBRE',
        tiendaDireccion: pedido.tienda.direccion ?? null,
        tiendaTelefono: pedido.tienda.telefono ?? null,
        tiendaRuc: pedido.tienda.ruc ?? null,
        tiendaEmail: pedido.tienda.emailTienda ?? null,

        pedidoId: pedido.id,
        usuarioId: user.sub,
        tiendaId: pedido.tiendaId,

        documentoDetalle: {
          create: items,
        },
      },
      include: {
        documentoDetalle: true,
      },
    }),

    this.prisma.serieCorrelativo.update({
      where: { id: serieCorrelativo.id },
      data: { ultimoNumero: nuevoNumero },
    }),

    this.prisma.pedido.update({
      where: { id: pedido.id },
      data: { estado: EstadoPedido.EMPAQUETADO }, // opcional
    }),
  ]);

  return documento;
}

  // Mostrar una boleta / factura por Id
  async mostrar(id: number, user: JwtPayload) {
    const documento = await this.prisma.documento.findFirst({
      where: { id, usuarioId: user.sub },
      include: {
        documentoDetalle: true,
      },
    });

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    return documento;
  }
}
