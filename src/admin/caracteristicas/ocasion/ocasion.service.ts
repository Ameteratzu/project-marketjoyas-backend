// ocasion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';

@Injectable()
export class OcasionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearGenericoDto) {
    return this.prisma.ocasion.create({ data: dto });
  }

async findAll(nombre?: string) {
  const where = nombre
    ? {
        nombre: {
          contains: nombre,
        },
      }
    : undefined;

  return this.prisma.ocasion.findMany({ where });
}


  async findOne(id: number) {
    const ocasion = await this.prisma.ocasion.findUnique({ where: { id } });
    if (!ocasion) throw new NotFoundException('Ocasión no encontrada');
    return ocasion;
  }

  async update(id: number, dto: ActualizarGenericoDto) {
    await this.findOne(id); // validación
    return this.prisma.ocasion.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ocasion.delete({ where: { id } });
  }
}
