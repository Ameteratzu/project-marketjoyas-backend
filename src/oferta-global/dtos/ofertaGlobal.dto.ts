import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OfertaGlobalDto {
  @ApiProperty({ 
    description: 'Título de la oferta global',
    example: 'Descuento de verano 2025'
  })
  @IsString()
  titulo: string;

  @ApiPropertyOptional({ 
    description: 'Descripción de la oferta',
    example: 'Aplica en todos los productos de verano'
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Descuento aplicado en la oferta (número decimal)',
    example: 15.5
  })
  @IsNumber()
  @Min(0)
  descuento: number;

  @ApiProperty({ 
    description: 'Fecha de validez de la oferta en formato ISO',
    example: '2025-12-31T23:59:59Z'
  })
  @IsDateString()
  validoHasta: string;

  @ApiPropertyOptional({ 
    description: 'IDs de los productos a los que se aplicará la oferta',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsOptional()
  productos?: number[];
}
