import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CrearProductoDto } from './crear-producto.dto';
import {
  IsOptional,
  IsArray,
  IsNumber,
  ArrayMaxSize,
  IsString,
} from 'class-validator';

export class UpdateProductoDto extends PartialType(CrearProductoDto) {
  @ApiPropertyOptional({
    description: 'Nuevas imágenes a agregar al producto (máx. 4)',
    example: [
      'https://miapp.com/images/nueva1.jpg',
      'https://miapp.com/images/nueva2.jpg',
    ],
    type: [String],
    maxItems: 4,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  imagenesNuevas?: string[];

  @ApiPropertyOptional({
    description: 'IDs de imágenes existentes que se deben eliminar',
    example: [3, 7],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  imagenesAEliminar?: number[];
}
