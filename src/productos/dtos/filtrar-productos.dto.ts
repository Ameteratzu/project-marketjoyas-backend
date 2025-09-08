import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsNumberString } from 'class-validator';

function transformArray(value: any) {
  if (typeof value === 'string') {
    return value.split(',').map((v) => parseInt(v.trim(), 10));
  }
  return value;
}

export class FiltrarProductosDto {
  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  materialIds?: number[];

  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  gemaIds?: number[];

  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  estiloIds?: number[];

  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsNumber({}, { each: true })
  ocasionIds?: number[];

  @IsOptional()
  @IsNumberString()
  precioMin?: string;

  @IsOptional()
  @IsNumberString()
  precioMax?: string;

  @IsOptional()
  orden?: 'precio_asc' | 'precio_desc' | 'fecha_asc' | 'fecha_desc';
}
