import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from './base/pipe/validation.pipe';
import { FormatResponseInterceptor } from './base/interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './base/interceptor/invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
