import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class CuponDto {

    @ApiProperty({ example: 20, description: 'Porcentaje o monto de descuento' })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    descuento: number;

    @ApiProperty({ example: 1, description: 'ID de la tienda a la que pertenece el cupón' })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    tiendaId: number;

    @ApiPropertyOptional({ example: 3, description: 'ID del producto específico (opcional)' })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    productoId?: number;

    @ApiProperty({ example: '2025-12-31T23:59:59Z', description: 'Fecha de vencimiento del cupón en formato ISO' })
    @IsNotEmpty()
    @IsDateString()
    validoHasta: string;
}