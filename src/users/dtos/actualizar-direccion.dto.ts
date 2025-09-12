import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarDireccionDto {
  @ApiProperty({ example: 'Av. Siempre Viva 742', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;
}
