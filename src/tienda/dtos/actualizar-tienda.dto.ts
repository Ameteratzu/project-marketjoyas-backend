// dtos/actualizar-tienda.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class ActualizarTiendaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsString()
  logo?: string;  

  @IsOptional()
  @IsString()
  logoPublicId?: string;
}
