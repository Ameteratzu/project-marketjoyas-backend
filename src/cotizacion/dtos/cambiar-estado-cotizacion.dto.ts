import { IsEnum } from 'class-validator';
import { EstadoCotizacion } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarEstadoCotizacionDto {
  @ApiProperty({
    description: 'Estado de la cotización, debe ser APROBADA o DENEGADA',
    enum: EstadoCotizacion,
    example: EstadoCotizacion.APROBADA,
  })
  @IsEnum(EstadoCotizacion, {
    message: 'Estado no válido. Debe ser APROBADA o DENEGADA',
  })
  estado: EstadoCotizacion;
}
