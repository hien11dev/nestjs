import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma.service';
import { PasswordReset, Prisma, User, VerifyToken } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/libs/bcrypt.service';
import { ForgotPasswordJobData, JwtPayload, TokenResponse, VerifyEmailJobData } from './types';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SHA256 } from 'crypto-js';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly profileService: ProfileService,
    @InjectQueue('forgot-password') private readonly forgotPasswordQueue: Queue,
    @InjectQueue('verify-email') private readonly verifyEmailQueue: Queue,
  ) { }

  async login(email: string, password: string): Promise<TokenResponse> {
    const user: User = await this.profileService.findOneByEmail(email);

    if (await this.bcryptService.compare(password, user.password)) {
      return this.generateToken(user);
    }

    throw new UnauthorizedException()
  }

  async register(data: Prisma.UserCreateInput): Promise<TokenResponse> {
    data.password = await this.bcryptService.hash(data.password);
    const user: User = await this.prisma.user.create({ data });
    // await this.verifyEmailQueue.add(<VerifyEmailJobData>{ email: user.email });
    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<TokenResponse> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      createdAt: Date.now()
    };

    return {
      accessToken: await this.jwtService.signAsync(payload)
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user: User = await this.profileService.findOneByEmail(email);

    // await this.forgotPasswordQueue.add(<ForgotPasswordJobData>{ email });

    return true;
  }

  async verify(email: string, code: string): Promise<boolean> {
    const user: User = await this.profileService.findOneByEmail(email);

    if (user.emailVerifiedAt) {
      return true;
    }

    const verifyToken: VerifyToken = await this.prisma.verifyToken.findUniqueOrThrow({ where: { email } });

    if (SHA256(code).toString() !== verifyToken.token) {
      throw new UnauthorizedException();
    }

    await this.profileService.update(user.id, {
      emailVerifiedAt: new Date
    });

    return true;
  }

  async resetPassword(email: string, code: string, password: string): Promise<boolean> {
    const user: User = await this.profileService.findOneByEmail(email);
    const resetToken: PasswordReset = await this.prisma.passwordReset.findUniqueOrThrow({ where: { email } });

    if (SHA256(code).toString() !== resetToken.token) {
      throw new UnauthorizedException();
    }

    const passwordHash = await this.bcryptService.hash(password);

    await this.profileService.update(user.id, {
      password: passwordHash
    })

    return true;
  }
}
