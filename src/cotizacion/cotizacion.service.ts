import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCotizacionDto } from './dtos/crear-cotizacion.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EstadoCotizacion } from '@prisma/client';

@Injectable()
export class CotizacionService {
  constructor(private readonly prisma: PrismaService) {}

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

  // Obtener todas las solicitudes de cotización con información del usuario
  async getAllSolicitudesCotizacion() {
    return this.prisma.solicitudCotizacion.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre_completo: true,
            telefono: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  //funcion para que usuario o quien sea cree solicitud de cotizacion

  async crearSolicitudCotizacion(dto: CrearCotizacionDto, user?: JwtPayload) {
    let usuarioId: number | undefined = undefined;
    let contactoNombre = dto.contactoNombre;
    let contactoEmail = dto.contactoEmail;
    let contactoTelefono = dto.contactoTelefono;

    if (user) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: user.sub },
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Si NO ingresó los campos manualmente, los llenamos con los datos del usuario
      const llenoCamposManualmente =
        contactoNombre || contactoEmail || contactoTelefono;

      if (!llenoCamposManualmente) {
        contactoNombre = usuario.nombre_completo;
        contactoEmail = usuario.email;
        contactoTelefono = usuario.telefono;
        usuarioId = user.sub; // Solo enlazamos al usuario si no fue modo anónimo
      }

      // Si los llenó manualmente, no asignamos usuarioId (queda como anónimo)
    }

    const nueva = await this.prisma.solicitudCotizacion.create({
      data: {
        usuarioId,
        imagenUrl: dto.imagenUrl,
        descripcion: dto.descripcion,
        contactoNombre,
        contactoEmail,
        contactoTelefono,
      },
    });

    return {
      message: 'Solicitud de cotización creada exitosamente',
      solicitud: nueva,
    };
  }

  // Ver todas las solicitudes aprobadas
  async getSolicitudesAprobadas() {
    return this.prisma.solicitudCotizacion.findMany({
      where: { estado: EstadoCotizacion.APROBADA },
      include: {
        usuario: {
          select: {
            id: true,
            nombre_completo: true,
            telefono: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  // Para que el cliente vea sus solicitudes
  async getSolicitudesPorUsuario(user: JwtPayload) {
    return this.prisma.solicitudCotizacion.findMany({
      where: { usuarioId: user.sub },
      orderBy: {
        id: 'desc',
      },
    });
  }

  // EFuncion para que un usuario elimine su solicitud
  async eliminarSolicitud(id: number, user: JwtPayload) {
    const solicitud = await this.prisma.solicitudCotizacion.findUnique({
      where: { id },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.usuarioId !== user.sub) {
      throw new ForbiddenException('No puedes eliminar esta solicitud');
    }

    await this.prisma.solicitudCotizacion.delete({
      where: { id },
    });

    return {
      message: 'Solicitud eliminada correctamente',
    };
  }
}
