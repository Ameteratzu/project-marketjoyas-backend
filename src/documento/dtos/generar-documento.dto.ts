import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TipoDocumento } from '@prisma/client';

export class GenerarDocumentoDto {
  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento;

  @IsString()
  @IsOptional()
  clienteNombre?: string;

  @IsString()
  @IsOptional()
  clienteDocumento?: string;

  @IsString()
  @IsOptional()
  clienteTelefono?: string;

  @IsString()
  @IsOptional()
  clienteEmail?: string;

  @IsString()
  @IsOptional()
  formaPago?: string;

  @IsString()
  @IsOptional()
  condVenta?: string;
}
