import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearDireccion } from './dtos/crear-direccion.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateDireccion } from './dtos/actualizar-direccion.dto';

//
@Injectable()
export class DireccionesService {
  constructor(private prisma: PrismaService) {}

  // Crear nueva dirección
  async create(dto: CrearDireccion, user: JwtPayload) {
    return this.prisma.direccionAdicional.create({
      data: {
        direccion: dto.direccion,
        departamento: dto.departamento,
        provincia: dto.provincia,
        distrito: dto.distrito,
        tipoDireccion: dto.tipoDireccion,
        usuario: { connect: { id: user.sub } },
      },
    });
  }

  // Obtener todas las direcciones del usuario autenticado
  async findAll(user: JwtPayload) {
    return this.prisma.direccionAdicional.findMany({
      where: { usuarioId: user.sub },
    });
  }

  // Obtener una dirección por id, asegurando que pertenece al usuario
  async findOne(id: number, user: JwtPayload) {
    const direccion = await this.prisma.direccionAdicional.findUnique({
      where: { id },
    });

    if (!direccion) {
      throw new NotFoundException('Dirección no encontrada');
    }

    if (direccion.usuarioId !== user.sub) {
      throw new ForbiddenException('No tienes acceso a esta dirección');
    }

    return direccion;
  }

  // Actualizar una dirección del usuario

  async update(id: number, dto: UpdateDireccion, user: JwtPayload) {
    const direccion = await this.prisma.direccionAdicional.findUnique({
      where: { id },
    });

    if (!direccion) {
      throw new NotFoundException('Dirección no encontrada');
    }

    if (direccion.usuarioId !== user.sub) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar esta dirección',
      );
    }

    return this.prisma.direccionAdicional.update({
      where: { id },
      data: dto,
    });
  }

  // Eliminar una dirección del usuario
  async remove(id: number, user: JwtPayload) {
    const direccion = await this.prisma.direccionAdicional.findUnique({
      where: { id },
    });

    if (!direccion) {
      throw new NotFoundException('Dirección no encontrada');
    }

    if (direccion.usuarioId !== user.sub) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta dirección',
      );
    }

    return this.prisma.direccionAdicional.delete({
      where: { id },
    });
  }
}
