// dtos/crear-tienda.dto.ts
import { IsString } from 'class-validator';

export class TiendaDto {
  @IsString()
  nombre_tienda: string;

  @IsString()
  direccion_tienda: string;

  @IsString()
  telefono_tienda: string;

  @IsString()
  pais: string;

  @IsString()
  ciudad: string;

  @IsString()
  provincia: string;

  @IsString()
  codigoPostal: string;
}
