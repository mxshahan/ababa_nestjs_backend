import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 3006;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app
    .listen(port)
    .then(() => console.info(`App running at port: ${port}`));
}
bootstrap();
