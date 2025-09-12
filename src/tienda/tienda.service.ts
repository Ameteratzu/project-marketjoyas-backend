import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarTiendaDto } from './dtos/actualizar-tienda.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class TiendaService {

    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService){}

//datos de todas las tiendas
async findAllPublic(nombre?: string) {
  const where = nombre
    ? {
        nombre: {
          contains: nombre,
        },
      }
    : undefined;

  return this.prisma.tienda.findMany({
    where,
    select: {
      id: true,
      nombre: true,
      logo: true,
    },
  });
}


//datos de la tienda

async findOnePublic(id: number) {
  const tienda = await this.prisma.tienda.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre_completo: true,
        },
      },
      productos: {
        where: { habilitado: true },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          precio: true,
          imagen: true,
          imagenes: {
            select: {
              url: true,
            },
          },
          calificaciones: {
            select: {
              estrellas: true,
            },
          },
        },
      },
    },
  });

  if (!tienda) throw new NotFoundException('Tienda no encontrada');

  // Calcular promedio general de la tienda (todas las calificaciones de todos los productos)
  const todasEstrellas = tienda.productos.flatMap((producto) =>
    producto.calificaciones.map((c) => c.estrellas),
  );

  const promedioGeneral =
    todasEstrellas.length > 0
      ? todasEstrellas.reduce((a, b) => a + b, 0) / todasEstrellas.length
      : null;

  // Calcular promedio individual por producto
  const productosConPromedio = tienda.productos.map((producto) => {
    const estrellas = producto.calificaciones.map((c) => c.estrellas);
    const promedio =
      estrellas.length > 0
        ? estrellas.reduce((a, b) => a + b, 0) / estrellas.length
        : null;

    return {
      ...producto,
      calificacionPromedio: promedio,
    };
  });

  return {
    ...tienda,
    productos: productosConPromedio,
    calificacionGeneral: promedioGeneral,
  };
}


//Actualizar tienda

async updateTienda(usuarioId: number, dto: ActualizarTiendaDto) {
  const tienda = await this.prisma.tienda.findUnique({
    where: { usuarioId },
  });

  if (!tienda) {
    throw new NotFoundException('Tienda no encontrada para este usuario');
  }

  // Copiamos el DTO para manipularlo
  const dataToUpdate: any = { ...dto };

  // Filtrar campos undefined para evitar pisar datos con null
  Object.keys(dataToUpdate).forEach((key) => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  // Eliminar logo anterior si se sube uno nuevo y ya hay uno guardado
  if (dto.logo && dto.logo !== tienda.logo && tienda.logoPublicId) {
    try {
      await this.cloudinary.deleteImage(tienda.logoPublicId);
    } catch (error) {
      console.error('Error al eliminar el logo anterior en Cloudinary:', error);
    }

    // Guardar nuevo logoPublicId si se provee
    dataToUpdate.logoPublicId = dto.logoPublicId || null;
  }

  const tiendaActualizada = await this.prisma.tienda.update({
    where: { usuarioId },
    data: dataToUpdate,
  });

  return tiendaActualizada;
}


}
