// dtos/crear-demovendedor.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearDemoVendedorDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
  })
  @IsNotEmpty()
  @IsString()
  nombre_completo: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juanperez@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+51987654321',
  })
  @IsNotEmpty()
  @IsString()
  telefono: string;

  @ApiProperty({
    description: 'Dirección del usuario (opcional)',
    example: 'Av. Siempre Viva 742',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Repuestos El Rápido',
  })
  @IsNotEmpty()
  @IsString()
  nombre_tienda: string;

  @ApiProperty({
    description: 'Dirección fiscal de la tienda (opcional)',
    example: 'Jr. Comercio 123, Cercado de Lima',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion_tienda?: string;

  @ApiProperty({
    description: 'Departamento donde se ubica la tienda (opcional)',
    example: 'Lima',
    required: false,
  })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiProperty({
    description: 'Provincia donde se ubica la tienda (opcional)',
    example: 'Lima',
    required: false,
  })
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiProperty({
    description: 'Distrito donde se ubica la tienda (opcional)',
    example: 'San Isidro',
    required: false,
  })
  @IsOptional()
  @IsString()
  distrito?: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'miSuperClave123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contraseña: string;
}
