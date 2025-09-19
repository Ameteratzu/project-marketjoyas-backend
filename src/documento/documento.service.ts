import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { TipoDocumento, EstadoPedido } from '@prisma/client';
import { GenerarDocumentoDto } from './dtos/generar-documento.dto';

@Injectable()
export class DocumentoService {
  constructor(private readonly prisma: PrismaService) {}

  async crearDocumentoDesdePedido(
    pedidoId: number,
    dto: GenerarDocumentoDto,
    user: JwtPayload,
  ) {
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
      throw new ForbiddenException(
        'No puedes generar documentos para otra tienda',
      );
    }

    if (pedido.documento) {
      throw new BadRequestException(
        'Este pedido ya tiene un documento generado',
      );
    }

    const estadosPermitidos: EstadoPedido[] = [
      EstadoPedido.PENDIENTE,
      EstadoPedido.EMPAQUETADO,
    ];

    if (!estadosPermitidos.includes(pedido.estado)) {
      throw new BadRequestException(
        'Solo se puede generar boleta en estado pendiente o empaquetado',
      );
    }

    const tipoDocumento = dto.tipoDocumento;

    const serieCorrelativo = await this.prisma.serieCorrelativo.findFirst({
      where: {
        tiendaId: pedido.tiendaId,
        tipoDocumento: tipoDocumento,
        activo: true,
      },
      orderBy: {
        creadoEn: 'asc',
      },
    });

    if (!serieCorrelativo) {
      throw new BadRequestException(
        'No existe una serie activa para este tipo de documento',
      );
    }

    const nuevoNumero = serieCorrelativo.ultimoNumero + 1;
    const numeroDocumento = `${serieCorrelativo.serie}-${String(nuevoNumero).padStart(4, '0')}`;

    // Calcular montos
    const items = pedido.productos.map((item) => {
      const precio = Number(item.producto.precio);
      const cantidad = item.cantidad;
      const total = precio * cantidad;
      return {
        productoNombre: item.producto.nombre,
        cantidad,
        precioUnitario: precio,
        total,
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const igv = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + igv).toFixed(2);

    // Transacción
    const [documento] = await this.prisma.$transaction([
      this.prisma.documento.create({
        data: {
          tipo: tipoDocumento,
          numero: numeroDocumento,
          serie: serieCorrelativo.serie,
          fechaEmision: new Date(),

          moneda: pedido.moneda ?? 'PEN',
          tipoCambio: pedido.tipoCambio ?? null,

          formaPago: dto.formaPago ?? pedido.formaPago ?? 'CONTADO',
          condVenta: dto.condVenta ?? null,

          subtotal,
          opGravado: subtotal,
          igv,
          total,

          clienteNombre: dto.clienteNombre ?? null,
          clienteDocumento: dto.clienteDocumento ?? null,
          clienteTelefono: dto.clienteTelefono ?? null,
          clienteEmail: dto.clienteEmail ?? null,

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
    ]);

    return documento;
  }


  // Mostrar una boleta / factura por Id
  async mostrar(id: number, user: JwtPayload){
    const documento = await this.prisma.documento.findFirst({
      where: { id, usuarioId: user.sub },
      include: {
        documentoDetalle: true,
      },
    });

    if(!documento){
      throw new NotFoundException("Documento no encontrado")
    }

    return documento;
  }
}
