import { IsInt } from 'class-validator';

export class CreateComparacionDto {
  @IsInt()
  productoId: number;
}
