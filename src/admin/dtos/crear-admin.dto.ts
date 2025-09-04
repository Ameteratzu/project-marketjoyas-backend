import { IsEmail, IsString, MinLength } from 'class-validator';

export class CrearAdminDto {
  @IsString()
  nombre_completo: string;

  @IsEmail()
  email: string;

  @IsString()
  dni: string;

  @IsString()
  telefono: string;

  @IsString()
  @MinLength(6)
  contraseña: string;
}
