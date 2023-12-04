import { Module } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, PrismaService, JwtStrategy],
    exports: [ProfileService],
})
export class ProfileModule {}
