// dtos/crear-cliente.dto.ts

import { IsString, IsEmail, Length } from 'class-validator';

export class CrearClienteDto {
  @IsString()
  nombre_completo: string;

  @IsEmail()
  email: string;

  @IsString()
  direccion: string;

  @IsString()
  @Length(8, 8, { message: 'DNI debe tener 8 caracteres' })
  dni: string;

  @IsString()
  telefono: string;

  @IsString()
  contraseña: string;
}
