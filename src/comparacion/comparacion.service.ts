import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComparacionService {
  constructor(private readonly prisma: PrismaService) {}

  // Agregar producto a comparacion
  async create(usuarioId: number, productoId: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }

    if (!producto.habilitado) {
      throw new ConflictException('No puedes añadir un producto deshabilitado a comparacion.');
    }

    try {
      return await this.prisma.comparacion.create({
        data: {
          usuarioId,
          productoId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este producto ya está en tu lista de comparacion.');
      }
      throw error;
    }
  }

  // Obtener la lista de comparacion del cliente
  async findByUsuario(usuarioId: number) {
    return this.prisma.comparacion.findMany({
      where: { usuarioId },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            imagen: true,
            material: true,
            gema: true,
            estilo: true,
            ocasion: true,
            habilitado: true,
          },
        },
      },
    });
  }

  // Eliminar producto de comparacion
  async deleteByProducto(usuarioId: number, productoId: number) {
    const comparacion = await this.prisma.comparacion.findUnique({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });

    if (!comparacion) {
      throw new NotFoundException('Este producto no está en tu lista de comparacion.');
    }

    return this.prisma.comparacion.delete({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });
  }
}
