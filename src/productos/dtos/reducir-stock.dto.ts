import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AumentarStockDto {
  @ApiProperty({ example: 5, description: 'Cantidad a modificar del stock' })
  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}
