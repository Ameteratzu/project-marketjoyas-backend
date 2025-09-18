
import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
  IsInt,
  Min,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormaPago, Moneda } from '@prisma/client';

export class ProductoActualizarDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class ActualizarPedidoDto {
  @IsOptional()
  @IsEnum(FormaPago)
  formaPago?: FormaPago;

  @IsOptional()
  @IsEnum(Moneda)
  moneda?: Moneda;

  @IsOptional()
  @IsNumber()
  tipoCambio?: number;

  @IsOptional()
  @IsString()
  condVenta?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique((o) => o.productoId)
  @Type(() => ProductoActualizarDto)
  productos?: ProductoActualizarDto[];
}
