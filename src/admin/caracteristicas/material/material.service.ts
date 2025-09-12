import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';

@Injectable()
export class MaterialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearGenericoDto) {
    return this.prisma.material.create({ data: dto });
  }


async findAll(nombre?: string) {
  const where = nombre
    ? {
        nombre: {
          contains: nombre,
        },
      }
    : undefined;

  return this.prisma.material.findMany({ where });
}



  async findOne(id: number) {
    const material = await this.prisma.material.findUnique({ where: { id } });
    if (!material) throw new NotFoundException('Material no encontrado');
    return material;
  }

  async update(id: number, dto: ActualizarGenericoDto) {
    await this.findOne(id); // Valida que exista
    return this.prisma.material.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.material.delete({ where: { id } });
  }
}