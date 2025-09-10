import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCotizacionDto } from './dtos/crear-cotizacion.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EstadoCotizacion } from '@prisma/client';

@Injectable()
export class CotizacionService {

      constructor(private readonly prisma: PrismaService) {}
    



    
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

  if (user) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: user.sub },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    usuarioId = user.sub;
  }

  const nueva = await this.prisma.solicitudCotizacion.create({
    data: {
      usuarioId: usuarioId,
      imagenUrl: dto.imagenUrl,
      descripcion: dto.descripcion,
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
