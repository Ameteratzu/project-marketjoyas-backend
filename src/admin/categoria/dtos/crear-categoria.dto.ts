import { IsString } from 'class-validator';

export class CrearCategoriaDto {
  @IsString()
  nombre: string;
}
