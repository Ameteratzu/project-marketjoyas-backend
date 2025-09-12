import { Module } from '@nestjs/common';
import { CertificadoJoyaController } from './certificado-joya.controller';
import { CertificadoJoyaService } from './certificado-joya.service';

@Module({
  controllers: [CertificadoJoyaController],
  providers: [CertificadoJoyaService]
})
export class CertificadoJoyaModule {}
