import { BaseQueryPaginate } from '@/utils/length-paginate';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindAllCategoryDto extends BaseQueryPaginate {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    name: string;
}
