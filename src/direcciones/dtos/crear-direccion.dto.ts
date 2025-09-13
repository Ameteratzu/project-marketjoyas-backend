import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CrearDireccion{

    @ApiProperty({ example: 'Av. Siempre Viva 742', description: 'Dirección completa' })
    @IsNotEmpty()
    @IsString()
    direccion: string;

    @ApiProperty({ example: 'Lima', description: 'Departamento' })
    @IsNotEmpty()
    @IsString()
    departamento: string;

    @ApiProperty({ example: 'Lima', description: 'Provincia' })
    @IsNotEmpty()
    @IsString()
    provincia: string;

    @ApiProperty({ example: 'Miraflores', description: 'Distrito' })
    @IsNotEmpty()
    @IsString()
    distrito: string;

    @ApiProperty({ example: 'Casa', description: 'Tipo de dirección (Casa, Oficina, Dpto, etc.)' })
    @IsNotEmpty()
    @IsString()
    tipoDireccion: string;

    @ApiProperty({ example: 1 , description: 'ID del usuario dueño de esta dirección' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    usuarioId: number;
}