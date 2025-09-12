import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoritoDto {
  @ApiProperty({
    description: 'ID del producto a agregar a favoritos', 
    example: 12
  })
  @IsInt()
  productoId: number;
}