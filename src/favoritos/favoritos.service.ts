import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE FAVORITOS/////////////////////////

@Injectable()
export class FavoritosService {
  constructor(private readonly prisma: PrismaService) {}


  //funcion para agregar a favoritos
 async create(usuarioId: number, productoId: number) {
  const producto = await this.prisma.producto.findUnique({
    where: { id: productoId },
  });

  if (!producto) {
    throw new NotFoundException('Producto no encontrado.');
  }

  if (!producto.habilitado) {
    throw new ConflictException('No puedes añadir un producto deshabilitado a favoritos.');
  }

  try {
    return await this.prisma.favorito.create({
      data: {
        usuarioId,
        productoId,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException('Ya has añadido este producto a favoritos.');
    }
    throw error;
  }
}


//funcion para obtener favoritos segun usuario
  async findByUsuario(usuarioId: number) {
    return this.prisma.favorito.findMany({
      where: { usuarioId },
      include: { producto: true },
    });
  }

  //funcion para quitar de favoritos

  async deleteByProducto(usuarioId: number, productoId: number) {
    const favorito = await this.prisma.favorito.findUnique({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });

    if (!favorito) throw new NotFoundException('Favorito no encontrado.');

    return this.prisma.favorito.delete({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId,
        },
      },
    });
  }
}
