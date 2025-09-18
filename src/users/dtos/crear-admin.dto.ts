// users/dtos/crear-admin.dto.ts

import { IsString, IsEmail, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearPrimerAdminDto {
  @ApiProperty({
    description: 'Nombre completo del administrador',
    example: 'Juan Pérez Torres',
  })
  @IsString()
  nombre_completo: string;

  @ApiProperty({
    description: 'Email del administrador',
    example: 'juan.perez@admin.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Dirección del administrador (opcional)',
    example: 'Calle 45 #123, Bogotá, Colombia',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'DNI del administrador (8 caracteres)',
    example: '87654321',
  })
  @IsString()
  @Length(8, 8, { message: 'DNI debe tener 8 caracteres' })
  dni: string;

  @ApiProperty({
    description: 'Número de teléfono del administrador',
    example: '+573001112233',
  })
  @IsString()
  telefono: string;

  @ApiProperty({
    description: 'Contraseña del administrador (mínimo 6 caracteres)',
    example: 'admin123',
    minLength: 6,
  })
  @IsString()
  contraseña: string;
}
