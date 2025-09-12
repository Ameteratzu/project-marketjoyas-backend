import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarInfoDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsOptional()
  @IsString()
  nombre_completo?: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'DNI debe tener 8 caracteres' })
  dni?: string;

  @ApiProperty({ example: '+51987654321', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'juan@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'MiClaveActual123', required: false })
  @IsOptional()
  @IsString()
  contraseña_actual?: string;

  @ApiProperty({ example: 'MiNuevaClave456', required: false })
  @IsOptional()
  @IsString()
  nueva_contraseña?: string;
}
