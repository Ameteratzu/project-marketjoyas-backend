import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({

  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProductosController],
  providers: [ProductosService, PrismaService, CloudinaryService]
})
export class ProductosModule {}
