import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; 
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    ProductosModule,
  ],
})
export class AppModule {}