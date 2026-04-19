import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  const openApiDoc = new DocumentBuilder()
    .setTitle('InBot API')
    .setDescription('The InBot API description')
    .setVersion('1.0')
    .addTag('inbot')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, openApiDoc);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
