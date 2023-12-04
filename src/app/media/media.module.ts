import { PrismaService } from '@/libs/prisma.service';
import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
    controllers: [MediaController],
    providers: [MediaService, PrismaService],
    imports: [AwsSdkModule.forFeatures([S3])],
})
export class MediaModule {}
