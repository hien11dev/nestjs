import { IsString, MaxLength } from 'class-validator';
import { IsUnique } from 'src/libs/class-validator/is-unique';

export class CreateCategoryDto {
    @IsString()
    @MaxLength(30)
    @IsUnique({ model: 'category', column: 'name' })
    name: string;
}
