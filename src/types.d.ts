import { User as UserModel } from '@prisma/client';

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends UserModel {}
    }
}

export interface JwtPayload {
    id: number;
    email: string;
    createdAt: number;
}

export interface VerifyEmailJobData {
    email: string;
}

export type ForgotPasswordJobData = VerifyEmailJobData;
