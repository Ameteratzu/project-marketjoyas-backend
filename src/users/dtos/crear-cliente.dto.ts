import { IsString, IsEmail, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearClienteDto {
  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'María García López'
  })
  @IsString()
  nombre_completo: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'maria.garcia@email.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Dirección del cliente (opcional)',
    example: 'Av. Principal 123, Lima, Perú (opcional)',
    required: false
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'DNI del cliente (8 caracteres)',
    example: '71234567'
  })
  @IsString()
  @Length(8, 8, { message: 'DNI debe tener 8 caracteres' })
  dni: string;

  @ApiProperty({
    description: 'Número de teléfono del cliente',
    example: '+51987654321'
  })
  @IsString()
  telefono: string;

  @ApiProperty({
    description: 'Contraseña del cliente',
    example: 'ClaveSegura123',
    minLength: 6
  })
  @IsString()
  contraseña: string;
}