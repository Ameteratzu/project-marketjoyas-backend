import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoriaIdDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la categoría (debe ser un número entero mayor a 0)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number) // Convierte string a number en peticiones HTTP
  categoriaId: number;
}
