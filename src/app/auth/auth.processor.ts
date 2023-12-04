import { ForgotPasswordJobData, VerifyEmailJobData } from '@/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SHA256 } from 'crypto-js';
import { PrismaService } from 'src/libs/prisma.service';

@Processor('auth')
export class AuthProcessor {
    constructor(private readonly prisma: PrismaService, private readonly mailService: MailerService) {}
    @Process('verifyEmail')
    async verifyEmail(job: Job<VerifyEmailJobData>) {
        console.log('job: ', job);
        try {
            const { email } = job.data;
            const token: string = Math.random().toFixed(6).slice(-6);
            const tokenHash = SHA256(token).toString();
            await this.prisma.verifyToken.upsert({
                where: { email },
                create: { email, token: tokenHash },
                update: { token: tokenHash, created_at: new Date() },
            });

            await this.mailService.sendMail({
                to: email,
                html: `<h1>${token}</h1>`,
            });

            return {};
        } catch (error) {
            console.log('error: ', error);
        }
    }

    @Process('forgotPassword')
    async forgotPassword(job: Job<ForgotPasswordJobData>) {
        console.log('job: ', job);
        try {
            const { email } = job.data;
            const token: string = Math.random().toFixed(6).slice(-6);
            const tokenHash = SHA256(token).toString();
            await this.prisma.passwordReset.upsert({
                where: { email },
                create: { email, token: tokenHash },
                update: { token: tokenHash, created_at: new Date() },
            });

            await this.mailService.sendMail({
                to: email,
                html: `<h1>${token}</h1>`,
            });

            return {};
        } catch (error) {}
    }
}
