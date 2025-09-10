import { Module } from '@nestjs/common';
import { TiendaController } from './tienda.controller';
import { TiendaService } from './tienda.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [TiendaController],
  providers: [TiendaService]
})
export class TiendaModule {}
