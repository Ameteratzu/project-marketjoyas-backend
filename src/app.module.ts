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
import { CotizacionModule } from './cotizacion/cotizacion.module';
import { TiendaModule } from './tienda/tienda.module';
import { CarritoModule } from './carrito/carrito.module';
import { CertificadoJoyaModule } from './certificado-joya/certificado-joya.module';

import { CalificacionesModule } from './calificaciones/calificaciones.module';

import { DireccionesModule } from './direcciones/direcciones.module';
import { PedidoModule } from './pedido/pedido.module';
import { CuponModule } from './cupon/cupon.module';
import { RecuperacionPasswordModule } from './recuperacion-password/recuperacion-password.module';
import { OfertaGlobalModule } from './oferta-global/oferta-global.module';



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
    CotizacionModule,
    TiendaModule,
    CarritoModule,
    CertificadoJoyaModule,

    CalificacionesModule,
    DireccionesModule,
    PedidoModule,
    CuponModule,
    RecuperacionPasswordModule,
    OfertaGlobalModule,

  ],
  providers: [CloudinaryService],
})
export class AppModule {}