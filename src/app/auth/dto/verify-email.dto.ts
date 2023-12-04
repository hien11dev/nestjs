import { IsNotEmpty, Matches } from 'class-validator';

export class VerifyEmailDto {
    @IsNotEmpty()
    @Matches(/\d{6}/)
    code: string;
}
