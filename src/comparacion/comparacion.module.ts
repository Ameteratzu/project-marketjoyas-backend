import { Module } from '@nestjs/common';
import { ComparacionController } from './comparacion.controller';
import { ComparacionService } from './comparacion.service';

@Module({
  controllers: [ComparacionController],
  providers: [ComparacionService]
})
export class ComparacionModule {}
