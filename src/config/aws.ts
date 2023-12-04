import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET,
}));
