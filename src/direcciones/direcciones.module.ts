import { Module } from '@nestjs/common';
import { DireccionesService } from './direccione.services';
import { DireccionesController } from './direcciones.controller';


@Module({
  controllers: [DireccionesController],
  providers: [DireccionesService], 
  exports: [DireccionesService],
})
export class DireccionesModule {}
