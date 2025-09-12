import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CrearCategoriaDto {
  @ApiProperty({
      description: 'Nombre de la entidad (único)',
      example: 'x',
    })
    @IsString()
    nombre: string;
}
