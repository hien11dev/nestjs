import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AuthModule } from './app/auth/auth.module';
import { CategoryModule } from './app/category/category.module';
import { MediaModule } from './app/media/media.module';
import { PostModule } from './app/post/post.module';
import { ProfileModule } from './app/profile/profile.module';
import configuration from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: configuration,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secretOrPrivateKey: config.get('auth.secret'),
                signOptions: {
                    expiresIn: 3600,
                },
            }),
            inject: [ConfigService],
            global: true,
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: async (config: ConfigService) => ({
                redis: config.get('redis'),
            }),
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get('mail.host'),
                    port: config.get('mail.port'),
                    auth: {
                        user: config.get('mail.user'),
                        pass: config.get('mail.pass'),
                    },
                },
                defaults: {
                    from: config.get('mail.user'),
                },
            }),
        }),
        AwsSdkModule.forRootAsync({
            defaultServiceOptions: {
                useFactory: (config: ConfigService) => ({
                    endpoint: config.get('aws.endpoint'),
                    region: config.get('aws.region'),
                    credentials: {
                        accessKeyId: config.get('aws.access_key'),
                        secretAccessKey: config.get('aws.secret_key'),
                    },
                    s3ForcePathStyle: true,
                    signatureVersion: 'v4',
                }),
                imports: [ConfigModule],
                inject: [ConfigService],
            },
        }),
        AuthModule,
        ProfileModule,
        CategoryModule,
        PostModule,
        MediaModule,
    ],
})
export class AppModule {}
