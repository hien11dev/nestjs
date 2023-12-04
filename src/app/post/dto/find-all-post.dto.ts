import { BaseQueryPaginate } from '@/utils/length-paginate';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class FindAllPostDto extends BaseQueryPaginate {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    title: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => +value)
    author: number;

    @IsOptional()
    @IsString()
    @Matches(/^[1-9]\d*(,[1-9]\d*)*$/)
    @Transform(({ value }) => value.split(',').map((category) => +category))
    category: number[];
}
