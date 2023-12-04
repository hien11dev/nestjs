import { IsEmail, IsString, IsStrongPassword } from "class-validator"
import { IsUnique } from "src/libs/class-validator/is-unique";

export class RegisterDto {
    @IsString()
    name: string

    @IsEmail()
    @IsUnique({ model: 'user', column: 'email' })
    email: string;

    @IsString()
    avatar: string

    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string
}
