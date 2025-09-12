import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComparacionDto {
  @ApiProperty({
    description: 'ID del producto a agregar a comparación',
    example: 8
  })
  @IsInt()
  productoId: number;
}