// dtos/crear-tienda.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TiendaDto {
  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Tienda Central',
  })
  @IsString()
  nombre_tienda: string;

  @ApiPropertyOptional({
    description: 'Dirección de la tienda',
    example: 'Av. Comercio 456',
  })
  @IsOptional()
  @IsString()
  direccion_tienda?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de la tienda',
    example: '+5112345678',
  })
  @IsOptional()
  @IsString()
  telefono_tienda?: string;

  @ApiPropertyOptional({
    description: 'País donde se encuentra la tienda',
    example: 'Perú',
  })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiPropertyOptional({
    description: 'Ciudad donde se encuentra la tienda',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({
    description: 'Provincia donde se encuentra la tienda',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiPropertyOptional({
    description: 'Código postal de la tienda',
    example: '15001',
  })
  @IsOptional()
  @IsString()
  codigoPostal?: string;
}
