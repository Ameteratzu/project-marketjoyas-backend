import { IsInt, Min } from 'class-validator';

export class AgregarCarritoDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}
