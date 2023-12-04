import { IsNotEmpty, Matches } from "class-validator";
import { ForgotPasswordDto } from "./forgot-password.dto";

export class VerifyEmailDto extends ForgotPasswordDto {
    @IsNotEmpty()
    @Matches(/[0-9]{6}/)
    code: string;
}
