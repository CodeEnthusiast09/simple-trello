import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
  logger.log(`Application is running on: http://localhost:3000`);
}

bootstrap().catch((error) => {
  console.error('Unhandled error in bootstrap:', error);

  process.exit(1);
});
