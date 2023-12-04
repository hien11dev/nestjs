import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    saltOrRounds: 10,
    secret: process.env.SECRET_KEY,
    token_expiration_time: parseInt(process.env.TOKEN_EXPIRATION_TIME, 10) || 3600,
}));
