// dtos/crear-trabajador.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CrearTrabajadorDto {
  @IsNotEmpty()
  @IsString()
  nombre_completo: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  contraseña: string;

  @IsString()
  telefono: string;

  @IsString()
  dni: string;
}
