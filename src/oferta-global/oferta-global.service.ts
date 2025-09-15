import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OfertaGlobalDto } from './dtos/ofertaGlobal.dto';


@Injectable()
export class OfertaGlobalService {
  constructor(private readonly prisma: PrismaService) { }

  // Crear una oferta global
  async create(dto: OfertaGlobalDto) {

    return this.prisma.ofertaGlobal.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        descuento: dto.descuento,
        validoHasta: new Date(dto.validoHasta),
        productos: dto.productos
          ? {
            connect: dto.productos.map((id) => ({ id })),
          }
          : undefined,
      },
      include: {
        productos: true,
      },
    });
  }

  // Obtener todas las ofertas
  async findAll() {
    return this.prisma.ofertaGlobal.findMany({
      include: {
        productos: true,
      },
    });
  }

  // Obtener una oferta por ID
  async findOne(id: number) {
    const oferta = await this.prisma.ofertaGlobal.findUnique({
      where: { id },
      include: { productos: true },
    });
    if (!oferta) throw new NotFoundException(`Oferta global con id ${id} no encontrada`);
    return oferta;
  }

  // Actualizar una oferta global
  async update(id: number, dto: OfertaGlobalDto) {
    const oferta = await this.prisma.ofertaGlobal.findUnique({ where: { id } });
    if (!oferta) throw new NotFoundException(`Oferta global no encontrada`);

    return this.prisma.ofertaGlobal.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        descuento: dto.descuento,
        validoHasta: dto.validoHasta ? new Date(dto.validoHasta) : undefined,
        productos: dto.productos
          ? {
            set: dto.productos.map((pid) => ({ id: pid })), // Reemplaza los productos asociados
          }
          : undefined,
      },
      include: {
        productos: true,
      },
    });
  }

  // Desactivar una oferta
  async desactivar(id: number) {
    const oferta = await this.prisma.ofertaGlobal.findUnique({ where: { id } });
    if (!oferta) throw new NotFoundException(`Oferta global no encontrada`);
    if (!oferta.activo) throw new BadRequestException(`La oferta ya está desactivada`);

    return this.prisma.ofertaGlobal.update({
      where: { id },
      data: { activo: false },
    });
  }

  // Activar una oferta
  async activar(id: number) {
    const oferta = await this.prisma.ofertaGlobal.findUnique({ where: { id } });
    if (!oferta) throw new NotFoundException(`Oferta global no encontrada`);
    if (oferta.activo) throw new BadRequestException(`La oferta ya está activa`);

    return this.prisma.ofertaGlobal.update({
      where: { id },
      data: { activo: true },
    });
  }

  // Eliminar una oferta global por ID
  async eliminar(id: number) {
    const oferta = await this.prisma.ofertaGlobal.findUnique({ where: { id } });
    if (!oferta) throw new NotFoundException(`Oferta global con id ${id} no encontrada`);

    return this.prisma.ofertaGlobal.delete({
      where: { id },
    });
  }

}
