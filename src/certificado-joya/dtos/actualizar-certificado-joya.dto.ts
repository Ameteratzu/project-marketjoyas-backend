// actualizar-certificado-joya.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CrearCertificadoJoyaDto } from './crear-certificado-joya.dto';

export class ActualizarCertificadoJoyaDto extends PartialType(CrearCertificadoJoyaDto) {}
