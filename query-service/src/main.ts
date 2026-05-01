import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Listen on a port different from catalog-service and order-service
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
