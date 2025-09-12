import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCertificadoJoyaDto {
  @ApiProperty({ example: 'Joyería El Dorado' })
  @IsString()
  tiendaNombre: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123' })
  @IsString()
  tiendaDireccion: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  clienteNombre: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  clienteDnioRUC: string;

  @ApiProperty({
    description: 'Nombre del producto joya',
    example: 'Anillo de compromiso oro 18k',
  })
  @IsString()
  productoNombre: string;

  @ApiProperty({
    description: 'ID de la gema principal',
    example: 3,
  })
  @IsInt()
  gemaId: number;

  @ApiProperty({
    description: 'ID del material de la joya',
    example: 2,
  })
  @IsInt()
  materialId: number;

  @ApiProperty({
    description: 'Precio de la joya',
    example: 1500.99,
  })
  @IsNumber()
  precio: number;

  @ApiProperty({
    description: 'URL de la imagen de la joya (opcional)',
    example: 'https://misimagenes.com/anillo-oro.jpg (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @ApiProperty({ example: 'Perú (opcional)', required: false })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiProperty({ example: 'Un anillo fino de oro 18k (opcional)', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
