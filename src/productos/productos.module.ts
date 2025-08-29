import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({

  imports: [PrismaModule],
  controllers: [ProductosController],
  providers: [ProductosService, PrismaService]
})
export class ProductosModule {}
