import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({

  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProductosController],
  providers: [ProductosService, PrismaService, CloudinaryService]
})
export class ProductosModule {}
