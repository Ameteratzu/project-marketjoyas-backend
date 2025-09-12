// estilo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';

@Injectable()
export class EstiloService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearGenericoDto) {
    return this.prisma.estilo.create({ data: dto });
  }

 async findAll(nombre?: string) {
  const where = nombre
    ? {
        nombre: {
          contains: nombre,
        },
      }
    : undefined;

  return this.prisma.estilo.findMany({ where });
}



  async findOne(id: number) {
    const estilo = await this.prisma.estilo.findUnique({ where: { id } });
    if (!estilo) throw new NotFoundException('Estilo no encontrado');
    return estilo;
  }

  async update(id: number, dto: ActualizarGenericoDto) {
    await this.findOne(id);
    return this.prisma.estilo.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.estilo.delete({ where: { id } });
  }
}
