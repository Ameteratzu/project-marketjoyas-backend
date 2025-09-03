import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; 
import { ProductosModule } from './productos/productos.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { ComparacionModule } from './comparacion/comparacion.module';
import { AdminModule } from './admin/admin.module';
import { CategoriaModule } from './admin/categoria/categoria.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    ProductosModule,
    CloudinaryModule,
    FavoritosModule,
    ComparacionModule,
    AdminModule,
    CategoriaModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}