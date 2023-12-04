import { IsEmail, IsNotEmpty } from "class-validator";
import { ForgotPasswordDto } from "./forgot-password.dto";

export class LoginDto extends ForgotPasswordDto {
    @IsNotEmpty()
    password: string;
}
