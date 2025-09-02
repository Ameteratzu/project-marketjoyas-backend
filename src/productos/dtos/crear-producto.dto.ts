import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { Estilo, Gema, Material, Ocasion } from '@prisma/client';

export class CrearProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  precio: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  enStock?: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  categoriaId?: number;

  @IsOptional()
  @IsString({ each: true })
  imagenes?: string[];

  @IsOptional()
  @IsEnum(Material)
  material?: Material;

  @IsOptional()
  @IsEnum(Ocasion)
  ocasion?: Ocasion;

  @IsOptional()
  @IsEnum(Gema)
  gema?: Gema;

  @IsOptional()
  @IsEnum(Estilo)
  estilo?: Estilo;
}
