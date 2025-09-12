import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

const basicAuth = require('express-basic-auth');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ PROTEGER /api Y /api-json CON USUARIO Y CONTRASEÑA
 app.use(
 ['/api', '/api-json'],
  basicAuth({
   users: { admin: 'marketjoyas909' }, 
   challenge: true,}),
);



  // ✅ CORS HABILITADO
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ VALIDACIONES GLOBALES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ CONFIGURACIÓN SWAGGER
  const config = new DocumentBuilder()
    .setTitle('MarketJoyas')
    .setDescription('Documentacion de endpoints de marketjoyas')
    .setVersion('1.0')
    .addTag('ENDPOINTS')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ GUARDAR EL JSON DOCUMENTATION LOCALMENTE
  if (!existsSync('./docs')) {
    mkdirSync('./docs');
  }
  writeFileSync('./docs/swagger.json', JSON.stringify(document, null, 2));

  // ✅ INICIALIZAR SWAGGER UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Documentación API - MarketJoyas',
  });

  // ✅ INICIAR SERVIDOR
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
