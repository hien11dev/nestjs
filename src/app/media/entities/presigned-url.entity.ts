import { S3 } from 'aws-sdk';

export class PresignedURLEntity {
    url: string;
    fields: S3.PresignedPost.Fields;
    constructor(data: S3.PresignedPost) {
        Object.assign(this, data);
    }
}
