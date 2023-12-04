import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { SuccessResponse, TokenResponse } from './types';
import { RegisterDto } from './dto/redister.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthGuard } from './auth.guard';


@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

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
    })
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<SuccessResponse> {
    const success = await this.authService.forgotPassword(email);
    return { success };
  }

  @Post('verify')
  async verifyEmail(@Body() { email, code }: VerifyEmailDto): Promise<SuccessResponse> {
    const success = await this.authService.verify(email, code);
    return { success };
  }

  @Post('reset')
  async resetPassword(@Body() { email, code, password }: ResetPasswordDto) {
    const success = await this.authService.resetPassword(email, code, password);
    return { success };
  }
}
