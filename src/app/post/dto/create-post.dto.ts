import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsExists } from 'src/libs/class-validator/is-exist';

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
    media: string[];

    @IsNotEmpty()
    @IsArray()
    @IsExists({ model: 'category', column: 'id' })
    categories: number[];
}
