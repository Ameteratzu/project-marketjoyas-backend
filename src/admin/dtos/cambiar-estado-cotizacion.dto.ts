import { IsEnum } from 'class-validator';
import { EstadoCotizacion } from '@prisma/client';

export class CambiarEstadoCotizacionDto {
  @IsEnum(EstadoCotizacion, {
    message: 'Estado no válido. Debe ser APROBADA o DENEGADA',
  })
  estado: EstadoCotizacion;
}
