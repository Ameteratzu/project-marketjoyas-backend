import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';

@Injectable()
export class GemaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearGenericoDto) {
    return this.prisma.gema.create({ data: dto });
  }

async findAll(nombre?: string) {
  const where = nombre
    ? {
        nombre: {
          contains: nombre,
        },
      }
    : undefined;

  return this.prisma.gema.findMany({ where });
}



  async findOne(id: number) {
    const gema = await this.prisma.gema.findUnique({ where: { id } });
    if (!gema) throw new NotFoundException('Gema no encontrada');
    return gema;
  }

  

  async update(id: number, dto: ActualizarGenericoDto) {
    await this.findOne(id); // valida existencia
    return this.prisma.gema.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.gema.delete({ where: { id } });
  }
}
