import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ForgotPasswordJobData } from './types';

@Processor('forgot-password')
export class ForgotPasswordProcessor {
    @Process('transcode')
    handleTranscode(job: Job<ForgotPasswordJobData>) {
        job.data
    }
}