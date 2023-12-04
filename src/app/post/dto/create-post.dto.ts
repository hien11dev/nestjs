import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray } from "class-validator";
import { IsExists } from "src/libs/class-validator/is-exist";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @MinLength(1)
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @MinLength(1)
    description: string;

    @IsNotEmpty()
    @IsArray()
    media: string[]

    @IsNotEmpty()
    @IsArray()
    @IsExists({ model: 'category', column: 'id' })
    categories: number[]
}
