import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/libs/prisma.service';
import { BcryptService } from 'src/libs/bcrypt.service';
import { BullModule } from '@nestjs/bull';
import { ForgotPasswordProcessor } from './forgot-password.processor';
import { VerifyEmailProcessor } from './verify-email.processor';
import { IsUniqueConstraint } from 'src/libs/class-validator/is-unique';
import { ProfileModule } from '../profile/profile.module';
import { ProfileService } from '../profile/profile.service';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    BcryptService,
    AuthService,
    ForgotPasswordProcessor,
    VerifyEmailProcessor,
    IsUniqueConstraint,
    ProfileService
  ],
  imports: [
    BullModule.registerQueue({
      name: 'forgot-password',
    }),
    BullModule.registerQueue({
      name: 'verify-email',
    }),
    ProfileModule
  ]
})
export class AuthModule { }
