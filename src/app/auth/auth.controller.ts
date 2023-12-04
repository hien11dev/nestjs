import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { SuccessResponse } from './entities/success.entity';
import { TokenResponse } from './entities/token.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() { email, password }: LoginDto): Promise<TokenResponse> {
        return this.authService.login(email, password);
    }

    @Post('register')
    register(@Body() user: RegisterDto): Promise<TokenResponse> {
        return this.authService.register({
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            password: user.password,
            active: true,
        });
    }

    @Post('forgot-password')
    async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<SuccessResponse> {
        const success = await this.authService.forgotPassword(email);
        return new SuccessResponse(success);
    }

    @Post('verify')
    @UseGuards(JwtAuthGuard)
    async verifyEmail(@Body() { code }: VerifyEmailDto, @Req() req: Request): Promise<SuccessResponse> {
        const success = await this.authService.verify(req.user.email, code);
        return new SuccessResponse(success);
    }

    @Post('reset-password')
    async resetPassword(@Body() { email, code, password }: ResetPasswordDto) {
        console.log('email, code, password: ', email, code, password);
        const success = await this.authService.resetPassword(email, code, password);
        return new SuccessResponse(success);
    }
}
