import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarTiendaDto {
  @ApiPropertyOptional({
    description: 'Nombre o razón social de la tienda',
    example: 'Mi Tienda S.A.C.',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Dirección fiscal de la tienda',
    example: 'Av. Principal 123, Lima',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto de la tienda',
    example: '+51987654321',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'País donde opera la tienda',
    example: 'Perú',
  })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiPropertyOptional({
    description: 'Ciudad donde está ubicada la tienda',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({
    description: 'Provincia de la tienda',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiPropertyOptional({
    description: 'Departamento de la tienda',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiPropertyOptional({
    description: 'Distrito de la tienda',
    example: 'San Isidro',
  })
  @IsOptional()
  @IsString()
  distrito?: string;

  @ApiPropertyOptional({ description: 'Código postal', example: '15036' })
  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @ApiPropertyOptional({
    description: 'Número de RUC de la tienda',
    example: '20481234567',
  })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de la tienda',
    example: 'contacto@mitienda.com',
  })
  @IsOptional()
  @IsEmail()
  emailTienda?: string;

  @ApiPropertyOptional({
    description: 'URL del logo de la tienda',
    example: 'https://res.cloudinary.com/tuapp/image/upload/v123456/logo.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    description: 'ID público del logo en Cloudinary',
    example: 'tienda/logo123',
  })
  @IsOptional()
  @IsString()
  logoPublicId?: string;
}
