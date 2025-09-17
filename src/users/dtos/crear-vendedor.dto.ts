// dtos/crear-vendedor.dto.ts
import { IsString, IsEmail, Length, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TiendaDto } from './crear-tienda.dto';

export class CrearVendedorDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del vendedor',
    example: 'Juan Pérez Gómez',
  })
  @IsString()
  nombre_completo: string;

  @ApiPropertyOptional({
    description: 'Nombre de usuario para el vendedor',
    example: 'juanperez123',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Email del vendedor',
    example: 'juan.perez@email.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Dirección del vendedor',
    example: 'Calle Falsa 123, Ciudad',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'DNI del vendedor (8 caracteres)',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'DNI debe tener 8 caracteres' })
  dni?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del vendedor',
    example: '+51987654321',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    description: 'Contraseña del vendedor',
    example: 'admin123',
    minLength: 6,
  })
  @IsString()
  contraseña: string;

  @ApiPropertyOptional({
    description: 'Datos de la tienda asociada',
    type: TiendaDto,
  })
  @ValidateNested()
  @Type(() => TiendaDto)
  tienda: TiendaDto;
}
