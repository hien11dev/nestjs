import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    );
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
        prefix: 'api/v',
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(configService.get('app.port'));
}

bootstrap();
