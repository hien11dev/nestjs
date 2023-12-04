import { PrismaService } from '@/libs/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('auth.secret'),
        });
    }

    async validate(payload: any): Promise<User> {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: payload.id,
                active: true,
            },
        });

        if (user) {
            return user;
        }

        throw new UnauthorizedException();
    }
}
