import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Use require to avoid ESM/CJS default interop issues on Node 22
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 4000;
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser());

  // Ensure uploads directory exists
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  const config = new DocumentBuilder()
    .setTitle('ZN Apparel API')
    .setDescription('API for products, categories, orders and auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
}

bootstrap();



