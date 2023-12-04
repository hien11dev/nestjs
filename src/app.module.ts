import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProfileModule } from './app/profile/profile.module';
import { CategoryModule } from './app/category/category.module';
import { PostModule } from './app/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('secret'),
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

      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis_host'),
          post: configService.get('redis_post'),
        }
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail_host'),
          port: configService.get('mail_host'),
          auth: {
            user: configService.get('mail_user'),
            pass: configService.get('mail_pass'),
          }
        },
        defaults: {
          from: configService.get('mail_user')
        }
      }),
    }),
    AuthModule,
    ProfileModule,
    CategoryModule,
    PostModule,
  ],
})
export class AppModule { }
