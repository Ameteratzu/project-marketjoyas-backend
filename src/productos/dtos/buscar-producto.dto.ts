import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BuscarProductoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Introducir al menos 2 caracteres.' })
  nombre: string;
}