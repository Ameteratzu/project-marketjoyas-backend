import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgregarCarritoDto {
  @ApiProperty({
    description: 'ID del producto a agregar al carrito',
    example: 5
  })
  @IsInt()
  productoId: number;

  @ApiProperty({
    description: 'Cantidad del producto (mínimo 1)',
    example: 2,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  cantidad: number;
}