import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CarritoService {
  constructor(private readonly prisma: PrismaService) {}

  // Funcion para agregar producto al carrito (sumar cantidad si ya existe)
  async agregarProducto(
    usuarioId: number,
    productoId: number,
    cantidad: number,
  ) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado.');
    if (!producto.habilitado) {
      throw new ConflictException('Producto no disponible actualmente.');
    }

    const itemExistente = await this.prisma.carritoProducto.findUnique({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });

    if (itemExistente) {
      // Sumar cantidad
      return this.prisma.carritoProducto.update({
        where: {
          usuarioId_productoId: {
            usuarioId,
            productoId,
          },
        },
        data: {
          cantidad: itemExistente.cantidad + cantidad,
        },
      });
    } else {
      // Crear nuevo item
      return this.prisma.carritoProducto.create({
        data: {
          usuarioId,
          productoId,
          cantidad,
        },
      });
    }
  }

  //////////////////// Obtener productos en el carrito de un usuario

  // Ahora organiza los productos del carrito agrupándolos por tienda
  // Por cada producto, calcula el subtotal multiplicando su precio por la cantidad seleccionada
  // Luego suma los subtotales de los productos para obtener un total por tienda
  // y finalmente calcula el total general del carrito sumando los totales de todas las tiendas


  async obtenerCarrito(usuarioId: number) {
    const productos = await this.prisma.carritoProducto.findMany({
      where: { usuarioId },
      include: {
        producto: {
          include: {
            tienda: {
              select: {
                id: true,
                telefono: true,
                emailTienda: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    const carritoPorTienda = productos.reduce(
      (acc, item) => {
        const tienda = item.producto.tienda;

        const tiendaId = tienda.id;

        // Convertir posibles null a string vacío (o el valor que quieras)
        const tiendaNormalizada = {
          id: tienda.id,
          nombre: tienda.nombre ?? '',
          telefono: tienda.telefono ?? '',
          emailTienda: tienda.emailTienda ?? '',
        };

        // Convertir Decimal a number
        const precio =
          item.producto.precio instanceof Decimal
            ? item.producto.precio.toNumber()
            : item.producto.precio;

        const subtotalProducto = precio * item.cantidad;

        if (!acc[tiendaId]) {
          acc[tiendaId] = {
            tienda: tiendaNormalizada,
            productos: [],
            subtotalTienda: 0,
          };
        }

        acc[tiendaId].productos.push({
          productoId: item.productoId,
          nombre: item.producto.nombre ?? '',
          precio,
          cantidad: item.cantidad,
          subtotalProducto,
        });

        acc[tiendaId].subtotalTienda += subtotalProducto;

        return acc;
      },
      {} as Record<
        number,
        {
          tienda: {
            id: number;
            telefono: string;
            emailTienda: string;
            nombre: string;
          };
          productos: {
            productoId: number;
            nombre: string;
            precio: number;
            cantidad: number;
            subtotalProducto: number;
          }[];
          subtotalTienda: number;
        }
      >,
    );

    const tiendas = Object.values(carritoPorTienda);

    // Redondear cada subtotalTienda a 2 decimales
    tiendas.forEach((tienda) => {
      tienda.subtotalTienda = Number(tienda.subtotalTienda.toFixed(2));
    });

    const totalGeneral = Number(
      tiendas
        .reduce((acc, tienda) => acc + tienda.subtotalTienda, 0)
        .toFixed(2),
    );

    return {
      tiendas,
      totalGeneral,
    };
  }

  // Disminuir cantidad (una unidad)
  async quitarUnaUnidad(usuarioId: number, productoId: number) {
    const item = await this.prisma.carritoProducto.findUnique({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });

    if (!item) throw new NotFoundException('Producto no está en el carrito.');

    if (item.cantidad <= 1) {
      // Eliminar completamente
      return this.prisma.carritoProducto.delete({
        where: {
          usuarioId_productoId: {
            usuarioId,
            productoId,
          },
        },
      });
    } else {
      // Reducir cantidad
      return this.prisma.carritoProducto.update({
        where: {
          usuarioId_productoId: {
            usuarioId,
            productoId,
          },
        },
        data: {
          cantidad: item.cantidad - 1,
        },
      });
    }
  }

  // Eliminar un producto del carrito completamente
  async eliminarProducto(usuarioId: number, productoId: number) {
    const item = await this.prisma.carritoProducto.findUnique({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });

    if (!item) throw new NotFoundException('Producto no está en el carrito.');

    return this.prisma.carritoProducto.delete({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });
  }

  // Vaciar carrito completamente
  async vaciarCarrito(usuarioId: number) {
    return this.prisma.carritoProducto.deleteMany({
      where: { usuarioId },
    });
  }
}
