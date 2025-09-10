import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CrearAdminDto } from './dtos/crear-admin.dto';
import { EstadoCotizacion, Rol } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE ADMIN/////////////////////////

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  //funcion parA crear nuevos admin

  async createAdmin(dto: CrearAdminDto) {
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ForbiddenException('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(dto.contraseña, 10);

    const adminUser = await this.prisma.usuario.create({
      data: {
        nombre_completo: dto.nombre_completo,
        email: dto.email,
        dni: dto.dni,
        telefono: dto.telefono,
        contraseña: hashedPassword,
        rol: 'ADMIN',
      },
    });

    return { message: 'Admin creado exitosamente', adminUser };
  }

  //Funcion para obtener todos los usuarios

  async getAllUsers() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre_completo: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        creadoEn: true,
      },
    });
  }

  //funcion para actualizar rol de usuarios

  async changeUserRole(userIdToUpdate: number, newRole: Rol, user: JwtPayload) {
    if (userIdToUpdate === user.sub) {
      throw new ForbiddenException('No puedes cambiar tu propio rol');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userIdToUpdate },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (user.rol !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para cambiar roles');
    }

    // Actualizar rol
    const updatedUser = await this.prisma.usuario.update({
      where: { id: userIdToUpdate },
      data: { rol: newRole },
    });

    return { message: 'Rol actualizado correctamente', updatedUser };
  }

  //Funcion para que un admin pueda aprobar o denegar una publicacion

  async cambiarEstadoCotizacion(id: number, estado: EstadoCotizacion) {
    const solicitud = await this.prisma.solicitudCotizacion.findUnique({
      where: { id },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de cotización no encontrada');
    }

    if (solicitud.estado !== 'PENDIENTE') {
      throw new BadRequestException('La solicitud ya fue procesada');
    }

    if (!['APROBADA', 'DENEGADA'].includes(estado)) {
      throw new BadRequestException('Estado inválido para esta operación');
    }

    const actualizada = await this.prisma.solicitudCotizacion.update({
      where: { id },
      data: { estado },
    });

    return {
      message: `Solicitud ${estado.toLowerCase()}`,
      solicitud: actualizada,
    };
  }

  //Funcion para ver las tiendas y sus subscripciones

  async getAllTiendas() {
    return this.prisma.tienda.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre_completo: true,
            email: true,
            dni: true,
            telefono: true,
            rol: true,
          },
        },
        suscripcion: true,
        trabajadores: {
          select: {
            id: true,
            nombre_completo: true,
            email: true,
            rol: true,
          },
        },
      },
    });
  }



}
