import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindAllCategoryDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    name: string;

    @IsOptional()
    @Transform(({ value }) => +value)
    @IsInt()
    @Min(1)
    page: number;

    @IsOptional()
    @Transform(({ value }) => +value)
    @IsInt()
    @Min(1)
    limit: number;
}
