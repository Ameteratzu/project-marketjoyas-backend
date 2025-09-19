import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearSerieDto } from './dtos/crear-serie.dto';
import { EditarSerieDto } from './dtos/editar-serie.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class SerieCorrelativoBService {
  constructor(private readonly prisma: PrismaService) {}

  async crearSerie(dto: CrearSerieDto, user: JwtPayload) {
    try {
      const nueva = await this.prisma.serieCorrelativo.create({
        data: {
          ...dto,
          tiendaId: user.tiendaId!,
        },
      });

      return {
        message: 'Serie creada correctamente',
        serie: nueva,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Ya existe una serie con ese tipo y nombre en esta tienda',
        );
      }
      throw error;
    }
  }

  async obtenerSeries(tiendaId: number) {
    return this.prisma.serieCorrelativo.findMany({
      where: { tiendaId },
      orderBy: {
        actualizadoEn: 'desc',
      },
    });
  }

  async obtenerPorId(id: number, tiendaId: number) {
    const serie = await this.prisma.serieCorrelativo.findFirst({
      where: { id, tiendaId },
    });

    if (!serie) {
      throw new NotFoundException('Serie no encontrada');
    }

    return serie;
  }

  async actualizarSerie(
    id: number,
    dto: EditarSerieDto,
    tiendaId: number,
  ) {
    const existe = await this.obtenerPorId(id, tiendaId);

    try {
      const actualizada = await this.prisma.serieCorrelativo.update({
        where: { id },
        data: dto,
      });

      return {
        message: 'Serie actualizada correctamente',
        serie: actualizada,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Ya existe una serie con ese tipo y nombre en esta tienda',
        );
      }
      throw error;
    }
  }

  async eliminarSerie(id: number, tiendaId: number) {
    await this.obtenerPorId(id, tiendaId);

    await this.prisma.serieCorrelativo.delete({ where: { id } });

    return { message: 'Serie eliminada correctamente' };
  }
}
