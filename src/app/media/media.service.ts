import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { PresignedURLEntity } from './entities/presigned-url.entity';

@Injectable()
export class MediaService {
    constructor(@InjectAwsService(S3) private readonly s3: S3, private readonly config: ConfigService) {}

    async getAvatarPresignedURL(): Promise<PresignedURLEntity> {
        const presignedURL = this.s3.createPresignedPost({
            Bucket: this.config.get('aws.bucket'),
            Expires: 3600,
            Conditions: [
                ['content-length-range', 0, 2 * 1024 * 1024],
                ['starts-with', '$Content-Type', 'image/jpeg'],
            ],
        });

        return new PresignedURLEntity(presignedURL);
    }

    async getPostPresignedURL(): Promise<PresignedURLEntity> {
        const presignedURL = this.s3.createPresignedPost({
            Bucket: this.config.get('aws.bucket'),
            Expires: 3600,
            Conditions: [
                ['content-length-range', 0, 5 * 1024 * 1024],
                ['starts-with', '$Content-Type', 'image/'],
            ],
        });

        return new PresignedURLEntity(presignedURL);
    }
}
