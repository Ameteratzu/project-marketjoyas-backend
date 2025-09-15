import { Module } from '@nestjs/common';
import { OfertaGlobalController } from './oferta-global.controller';
import { OfertaGlobalService } from './oferta-global.service';

@Module({
  controllers: [OfertaGlobalController],
  providers: [OfertaGlobalService]
})
export class OfertaGlobalModule {}
