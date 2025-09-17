import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsNumberString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

function transformArray(value: any) {
  if (typeof value === 'string') {
    return value.split(',').map((v) => parseInt(v.trim(), 10));
  }
  return value;
}

export enum OrdenEnum {
  PRECIO_ASC = 'precio_asc',
  PRECIO_DESC = 'precio_desc',
  FECHA_ASC = 'fecha_asc',
  FECHA_DESC = 'fecha_desc',
}


export class FiltrarProductosDto {
  @ApiPropertyOptional({
    description: 'IDs de materiales (puedes pasar múltiples separados por coma: 1,2,3)',
    example: '1,2,3',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  materialIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de gemas (separados por coma)',
    example: '4,6',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  gemaIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de estilos (separados por coma)',
    example: '2,3',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  estiloIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de ocasión (separados por coma)',
    example: '1,5',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  ocasionIds?: number[];

  @ApiPropertyOptional({
    description: 'Precio mínimo (como string numérico)',
    example: '20.00',
  })
  @IsOptional()
  @IsNumberString()
  precioMin?: string;

  @ApiPropertyOptional({
    description: 'Precio máximo (como string numérico)',
    example: '100.00',
  })
  @IsOptional()
  @IsNumberString()
  precioMax?: string;

 @ApiPropertyOptional({
  description: 'Orden para los resultados',
  example: OrdenEnum.PRECIO_ASC,
  enum: OrdenEnum,
})
@IsOptional()
@IsEnum(OrdenEnum)
orden?: OrdenEnum;

}
