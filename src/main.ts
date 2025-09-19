import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

const basicAuth = require('express-basic-auth');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Prefijo GLOBAL de la API: /api  --> tus controladores quedarán en /api/...
  app.setGlobalPrefix('api');

  // 2) Proteger SOLO Swagger (UI y JSON) con Basic Auth en /docs (NO usar /api)
  const SWAGGER_PATH = 'docs';
  app.use([`/${SWAGGER_PATH}`, `/${SWAGGER_PATH}-json`],
    basicAuth({
      users: { admin: 'marketjoyas909' },  // <-- si quieres, lee de variables de entorno
      challenge: true,
    }),
  );

  // 3) CORS (ajústalo cuando pases a dominio)
  app.enableCors({
    origin: '*',                       // luego: ['https://centrojoyero.com.pe', 'https://www.centrojoyero.com.pe']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
  });

  // 4) Validaciones
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // 5) Swagger
  const config = new DocumentBuilder()
    .setTitle('MarketJoyas')
    .setDescription('Documentación de endpoints de marketjoyas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (!existsSync('./docs')) mkdirSync('./docs');
  writeFileSync('./docs/swagger.json', JSON.stringify(document, null, 2));

  // Montar Swagger en /docs (NO en /api)
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Documentación API - MarketJoyas',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();