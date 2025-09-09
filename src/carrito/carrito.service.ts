import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarritoService {
  constructor(private readonly prisma: PrismaService) {}

  // Funcion para agregar producto al carrito (sumar cantidad si ya existe)
  async agregarProducto(usuarioId: number, productoId: number, cantidad: number) {
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

  // Obtener productos en el carrito de un usuario
  async obtenerCarrito(usuarioId: number) {
    return this.prisma.carritoProducto.findMany({
      where: { usuarioId },
      include: {
        producto: true,
      },
    });
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
