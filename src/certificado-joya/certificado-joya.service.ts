// certificado-joya.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCertificadoJoyaDto } from './dtos/crear-certificado-joya.dto';
import { ActualizarCertificadoJoyaDto } from './dtos/actualizar-certificado-joya.dto';

@Injectable()
export class CertificadoJoyaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tiendaId: number, dto: CrearCertificadoJoyaDto) {
  return this.prisma.certificadoJoya.create({
    data: {
      tiendaNombre: dto.tiendaNombre,
      tiendaDireccion: dto.tiendaDireccion,
      clienteNombre: dto.clienteNombre,
      clienteDnioRUC: dto.clienteDnioRUC,
      productoNombre: dto.productoNombre,
      gemaId: dto.gemaId,
      materialId: dto.materialId,
      precio: dto.precio,
      imagenUrl: dto.imagenUrl,
      pais: dto.pais,
      descripcion: dto.descripcion,
    },
  });
}


async findAll(): Promise<any[]> {
  return this.prisma.certificadoJoya.findMany({
    include: {
      gema: { select: { nombre: true } },
      material: { select: { nombre: true } },
    },
  });
}

async findOne(id: number): Promise<any> {
  const certificado = await this.prisma.certificadoJoya.findUnique({
    where: { id },
    include: {
      gema: { select: { nombre: true } },
      material: { select: { nombre: true } },
    },
  });

  if (!certificado) throw new NotFoundException('Certificado no encontrado');
  return certificado;
}


 async update(id: number, dto: ActualizarCertificadoJoyaDto) {
  await this.findOne(id); // solo con id
  return this.prisma.certificadoJoya.update({
    where: { id },
    data: dto,
  });
}

async remove(id: number) {
  await this.findOne(id);
  return this.prisma.certificadoJoya.delete({
    where: { id },
  });
}

}
//