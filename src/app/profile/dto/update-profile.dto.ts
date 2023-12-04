import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    avatar: string;

    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string;
}
