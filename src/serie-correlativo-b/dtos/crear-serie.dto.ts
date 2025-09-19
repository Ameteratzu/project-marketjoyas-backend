import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CrearSerieDto {
  @ApiProperty({ example: 'BOLETA', description: 'Tipo de documento' })
  @IsString()
  @IsNotEmpty()
  tipoDocumento: string;

  @ApiProperty({ example: 'B001', description: 'Serie del documento' })
  @IsString()
  @IsNotEmpty()
  serie: string;

  @ApiProperty({ example: 0, description: 'Último número utilizado' })
  @IsInt()
  @Min(0)
  ultimoNumero: number;

  @ApiProperty({ example: true, description: 'Estado activo o inactivo' })
  @IsBoolean()
  activo: boolean;
}
