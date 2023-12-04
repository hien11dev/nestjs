import { IsEmail, IsNotEmpty, IsStrongPassword, Matches } from "class-validator";
import { VerifyEmailDto } from "./verify-email.dto";

export class ResetPasswordDto extends VerifyEmailDto {
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string
}
