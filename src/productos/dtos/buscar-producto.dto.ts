import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuscarProductoDto {
  @ApiProperty({
    example: 'anillo',
    description: 'Nombre del producto a buscar (mínimo 2 caracteres)',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Introducir al menos 2 caracteres.' })
  nombre: string;
}
