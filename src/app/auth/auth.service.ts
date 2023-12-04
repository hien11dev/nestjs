import { ForgotPasswordJobData, JwtPayload, VerifyEmailJobData } from '@/types';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordReset, Prisma, User, VerifyToken } from '@prisma/client';
import { Queue } from 'bull';
import { SHA256 } from 'crypto-js';
import { BcryptService } from 'src/libs/bcrypt.service';
import { PrismaService } from 'src/libs/prisma.service';
import { ProfileService } from '../profile/profile.service';
import { TokenResponse } from './entities/token.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly bcryptService: BcryptService,
        private readonly profileService: ProfileService,
        private readonly config: ConfigService,
        @InjectQueue('auth')
        private readonly queue: Queue,
    ) {}

    async login(email: string, password: string): Promise<TokenResponse> {
        const user: User = await this.profileService.findOneByEmail(email);

        if ((await this.bcryptService.compare(password, user.password)) && user.active) {
            return this.generateToken(user);
        }

        throw new UnauthorizedException();
    }

    async register(data: Prisma.UserCreateInput): Promise<TokenResponse> {
        data.password = await this.bcryptService.hash(data.password);
        const user: User = await this.prisma.user.create({ data });
        try {
            await this.queue.add('verifyEmail', <VerifyEmailJobData>{ email: user.email });
        } catch (error) {
            await this.prisma.user.delete({ where: { id: user.id } });
            throw error;
        }

        return this.generateToken(user);
    }

    async generateToken(user: User): Promise<TokenResponse> {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            createdAt: Date.now(),
        };

        const accessToken = this.jwtService.sign(payload);

        return new TokenResponse(accessToken);
    }

    async forgotPassword(email: string): Promise<boolean> {
        const user: User = await this.profileService.findOneByEmail(email);

        await this.queue.add('forgotPassword', <ForgotPasswordJobData>{ email: user.email });

        return true;
    }

    async verify(email: string, code: string): Promise<boolean> {
        const user: User = await this.profileService.findOneByEmail(email);

        if (user.email_verified_at) {
            return true;
        }

        const verifyToken: VerifyToken = await this.prisma.verifyToken.findUniqueOrThrow({ where: { email } });

        const expired = Date.now() - this.config.get('auth.token_expiration_time') * 1000;

        if (new Date(verifyToken.created_at).getTime() < expired) {
            await this.prisma.verifyToken.delete({ where: { email } });
            throw new HttpException('Token expired', 401);
        }

        if (SHA256(code).toString() !== verifyToken.token) {
            throw new UnauthorizedException();
        }

        await this.profileService.update(user.id, {
            email_verified_at: new Date(),
        });

        return true;
    }

    async resetPassword(email: string, code: string, password: string): Promise<boolean> {
        const user: User = await this.profileService.findOneByEmail(email);
        const resetToken: PasswordReset = await this.prisma.passwordReset.findUniqueOrThrow({ where: { email } });

        const expired = Date.now() - this.config.get('auth.token_expiration_time') * 1000;

        if (new Date(resetToken.created_at).getTime() < expired) {
            await this.prisma.verifyToken.delete({ where: { email } });
            throw new HttpException('Token expired.', 401);
        }

        if (SHA256(code).toString() !== resetToken.token) {
            throw new UnauthorizedException('Invalid code.');
        }

        const passwordHash = await this.bcryptService.hash(password);

        await this.profileService.update(user.id, {
            password: passwordHash,
        });

        return true;
    }
}
