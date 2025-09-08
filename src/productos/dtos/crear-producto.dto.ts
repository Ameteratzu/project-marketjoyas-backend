import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';


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
  @Type(() => Number)
  @IsNumber()
  materialId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ocasionId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gemaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estiloId?: number;
}
