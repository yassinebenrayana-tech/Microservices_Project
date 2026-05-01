import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Start on a different port than catalog-service
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
