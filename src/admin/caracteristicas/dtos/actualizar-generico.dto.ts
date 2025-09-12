import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ActualizarGenericoDto {
  @ApiProperty({
    description: 'Nombre de la entidad (unico)',
    example: 'Moderno',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre?: string;
}
