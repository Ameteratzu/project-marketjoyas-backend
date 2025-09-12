import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearProductoDto {
  @ApiProperty({ example: 'Collar de plata', description: 'Nombre del producto' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Un hermoso collar con incrustaciones', description: 'Descripción del producto OPCIONAL' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 59.99, description: 'Precio del producto', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  precio: number;

  @ApiPropertyOptional({ example: 10, description: 'Cantidad disponible en stock', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  enStock?: number;

  @ApiPropertyOptional({ example: 'https://miapp.com/images/producto.jpg', description: 'Imagen principal del producto' })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({ example: 2, description: 'ID de la categoría OPCIONAL', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  categoriaId?: number;

  @ApiPropertyOptional({
    example: [
      'https://miapp.com/images/producto1.jpg',
      'https://miapp.com/images/producto2.jpg',
    ],
    description: 'Arreglo de URLs de imágenes adicionales',
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  imagenes?: string[];

  @ApiPropertyOptional({ example: 3, description: 'ID del material OPCIONAL' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  materialId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la ocasión OPCIONAL' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ocasionId?: number;

  @ApiPropertyOptional({ example: 4 , description: 'ID de la gema OPCIONAL' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gemaId?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID del estilo OPCIONAL' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estiloId?: number;
}
