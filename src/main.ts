import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //CORS HABILITADO

  app.enableCors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
});


    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en el DTO
      transform: true, // convierte tipos automáticamente según DTO
      forbidNonWhitelisted: true, // opcional, lanza error si hay campos extra
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MarketJoyas')
    .setDescription('Documentacion de endpoints de marketjoyas')
    .setVersion('1.0')
    .addTag('ENDPOINTS')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  if (!existsSync('./docs')) {
    mkdirSync('./docs');
  }
  writeFileSync('./docs/swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
