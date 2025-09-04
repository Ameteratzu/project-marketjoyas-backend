import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CrearCotizacionDto {
  @IsNotEmpty()
  @IsUrl()
  imagenUrl: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
