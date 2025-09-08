import { PartialType } from '@nestjs/swagger';
import { CrearProductoDto } from './crear-producto.dto';
import { IsOptional, IsArray, IsNumber, ArrayMaxSize } from 'class-validator';

export class UpdateProductoDto extends PartialType(CrearProductoDto) {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  imagenesNuevas?: string[]; 

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  imagenesAEliminar?: number[]; 
}
