import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as hbs from 'hbs';
import * as helmet from 'helmet';
import { resolve } from 'path';

import { ApiModule } from '@api/api.module';
import { AuthModule } from '@api/auth';
import { AuthGuard } from '@api/auth/auth.guard';

import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/exceptions/exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  if (process.env.NODE_ENV === 'production') app.use(helmet);
  app.set('trust proxy', 1);

  if (process.env.NODE_ENV === 'development') {
    const swaggerClientOption = new DocumentBuilder()
      .setTitle('Accounting API')
      .setDescription('The Accounting API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const apiDocument = SwaggerModule.createDocument(app, swaggerClientOption, {
      include: [ApiModule],
      deepScanRoutes: true
    });
    SwaggerModule.setup('doc/api/', app, apiDocument);
  }

  const authGuard = app.select(AuthModule).get(AuthGuard);
  app.useGlobalGuards(authGuard);
  app.useGlobalFilters(new AppExceptionFilter());
  app.useStaticAssets(resolve('.', 'public'));
  app.setBaseViewsDir(resolve('.', './src/views'));
  app.setViewEngine('hbs');
  hbs.registerHelper('plusify', string => {
    return string.replace(/ /g, '+');
  });
  hbs.registerHelper('dateFormat', string => {
    return string.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      errorHttpStatusCode: 422
    })
  );

  await app.listen(3001, () => {
    console.log('Listen on port: ' + 3001);
  });
}
bootstrap();
