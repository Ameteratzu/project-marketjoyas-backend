import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoriaIdDto {
  @IsInt()
  @Min(1)
  @Type(() => Number) // Muy importante para transformar string a number
  categoriaId: number;
}
