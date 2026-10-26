import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './common/filters/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Valida los DTOs, descarta y rechaza campos que no estan declarados
  // y convierte los query params a los tipos del DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Traduce errores de PostgreSQL (UNIQUE, FK) a 409 / 404
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
