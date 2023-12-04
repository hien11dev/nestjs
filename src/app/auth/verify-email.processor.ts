import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VerifyEmailJobData } from './types';
import { PrismaService } from 'src/libs/prisma.service';
import { SHA256 } from 'crypto-js';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('verify-email')
export class VerifyEmailProcessor {
    constructor(private readonly prisma: PrismaService, private readonly mailService: MailerService) { }
    @Process('transcode')
    async handleTranscode(job: Job<VerifyEmailJobData>) {
        try {
            const { email } = job.data;
            const token: string = Math.random().toFixed(6).slice(-6);
            const tokenHash = SHA256(token).toString();
            const verifyToken = await this.prisma.verifyToken.upsert({
                where: { email },
                create: { email, token: tokenHash },
                update: { token: tokenHash, createdAt: new Date }
            });

            await this.mailService.sendMail({
                to: email,
                html: `<h1>${token}</h1>`
            });

            return {};

        } catch (error) {

        }
    }
}