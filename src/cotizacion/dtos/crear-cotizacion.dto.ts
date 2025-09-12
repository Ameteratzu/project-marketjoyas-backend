import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCotizacionDto {
  @ApiProperty({
    description: 'URL de la imagen para la cotización',
    example: 'https://example.com/imagen.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  imagenUrl: string;

  @ApiProperty({
    description: 'Descripción u observaciones para la cotización',
    example: 'Necesito un presupuesto para 100 unidades',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({
    description: 'Email de contacto (opcional, para usuarios no autenticados)',
    example: ' Si no esta autenticado: contacto@correo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  contactoEmail?: string;

  @ApiProperty({
    description: 'Teléfono de contacto (opcional, para usuarios no autenticados)',
    example: 'Si no esta autenticado: +51987654321',
    required: false,
  })
  @IsOptional()
  @Matches(/^[0-9+\-\s]{7,15}$/, { message: 'Teléfono inválido' })
  contactoTelefono?: string;

  @ApiProperty({
    description: 'Nombre completo de contacto (opcional, para usuarios no autenticados)',
    example: 'Si no esta autenticado: Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactoNombre?: string;
}
