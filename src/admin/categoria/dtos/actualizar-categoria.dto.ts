import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ActualizarCategoriaDto {
  @ApiProperty({
        description: 'Nombre de la entidad (único)',
        example: 'x',
      })
      @IsString()
      nombre: string;
}
