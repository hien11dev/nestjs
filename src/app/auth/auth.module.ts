import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BcryptService } from 'src/libs/bcrypt.service';
import { IsUniqueConstraint } from 'src/libs/class-validator/is-unique';
import { PrismaService } from 'src/libs/prisma.service';
import { ProfileModule } from '../profile/profile.module';
import { ProfileService } from '../profile/profile.service';
import { AuthController } from './auth.controller';
import { AuthProcessor } from './auth.processor';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [AuthController],
    providers: [
        PrismaService,
        BcryptService,
        AuthService,
        AuthProcessor,
        IsUniqueConstraint,
        ProfileService,
        JwtStrategy,
    ],
    imports: [
        BullModule.registerQueue({
            name: 'auth',
            defaultJobOptions: {
                removeOnComplete: true,
            },
        }),
        ProfileModule,
    ],
})
export class AuthModule {}
