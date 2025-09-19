import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';


///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE CATEGORIA/////////////////////////


@Injectable()
export class CategoriaService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear categoria
  async createCategory(dto: CrearCategoriaDto) {
    const exists = await this.prisma.categoria.findUnique({
      where: { nombre: dto.nombre },
    });

    if (exists) throw new ForbiddenException('La categoría ya existe');

    return this.prisma.categoria.create({
      data: {
        nombre: dto.nombre,
      },
    });
  }

  // Actualizar categoria
  async updateCategory(id: number, dto: ActualizarCategoriaDto) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    const otraCategoriaConMismoNombre = await this.prisma.categoria.findFirst({
      where: {
        nombre: dto.nombre,
        NOT: {
          id: id,
        },
      },
    });

    if (otraCategoriaConMismoNombre) {
      throw new ForbiddenException('Ya existe otra categoría con ese nombre');
    }

    return this.prisma.categoria.update({
      where: { id },
      data: {
        nombre: dto.nombre,
      },
    });
  }

  // Eliminar categoria
  async deleteCategory(id: number) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    return this.prisma.categoria.delete({ where: { id } });
  }

// Obtener categorías con filtro opcional
async getAllPublic(nombre?: string) {
  const where = nombre
    ? {
        nombre: {
          contains: nombre, // sin mode
        },
      }
    : undefined;

  return this.prisma.categoria.findMany({
    where,
    select: {
      id: true,
      nombre: true,
    },
  });
}

async findOne(id: number) {
    const estilo = await this.prisma.categoria.findUnique({ where: { id } });
    if (!estilo) throw new NotFoundException('Categoria no encontrado');
    return estilo;
  }


}
