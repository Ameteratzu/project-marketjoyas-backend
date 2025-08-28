// dtos/crear-vendedor.dto.ts
import { IsString, IsEmail, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TiendaDto } from './crear-tienda.dto';

export class CrearVendedorDto {
  @IsString()
  nombre_completo: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  direccion: string;

  @IsString()
  @Length(8, 8)
  dni: string;

  @IsString()
  telefono: string;

  @IsString()
  contraseña: string;

  @ValidateNested()
  @Type(() => TiendaDto)
  tienda: TiendaDto; // datos de la tienda
}
