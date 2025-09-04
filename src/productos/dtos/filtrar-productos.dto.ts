import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { Material, Gema, Estilo, Ocasion } from '@prisma/client';
import { Transform } from 'class-transformer';

function transformArray(value: any) {
  if (typeof value === 'string') {
    return value.split(',').map((v) => v.trim());
  }
  return value;
}

export class FiltrarProductosDto {
  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsEnum(Material, { each: true })
  material?: Material[];

  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsEnum(Gema, { each: true })
  gema?: Gema[];

  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsEnum(Estilo, { each: true })
  estilo?: Estilo[];

  @IsOptional()
  @Transform(({ value }) => transformArray(value))
  @IsEnum(Ocasion, { each: true })
  ocasion?: Ocasion[];

  @IsOptional()
  @IsNumberString()
  precioMin?: string;

  @IsOptional()
  @IsNumberString()
  precioMax?: string;

  @IsOptional()
  orden?: 'precio_asc' | 'precio_desc' | 'fecha_asc' | 'fecha_desc';
}
