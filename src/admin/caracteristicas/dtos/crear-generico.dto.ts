import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CrearGenericoDto {
  @ApiProperty({
    description: 'Nombre de la entidad (unico)',
    example: 'x',
  })
  @IsString()
  nombre: string;
}
