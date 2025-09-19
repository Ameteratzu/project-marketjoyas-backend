import { IsEnum } from 'class-validator';
import { EstadoCalificacion } from '@prisma/client'; // importa tu enum

export class ActualizarEstadoDto {
  @IsEnum(EstadoCalificacion, { message: 'Estado inválido' })
  estado: EstadoCalificacion;
}