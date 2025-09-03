import { IsString } from 'class-validator';

export class ActualizarCategoriaDto {
  @IsString()
  nombre: string;
}
