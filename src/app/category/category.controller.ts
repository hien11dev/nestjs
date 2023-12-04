import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { Response } from 'express';
import * as slug from 'slug';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindAllCategoryDto } from './dto/find-all-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryPaginate } from './entities/category.entity';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async findAll(@Query() query: FindAllCategoryDto): Promise<CategoryPaginate> {
        return this.categoryService.findAll(query);
    }

    @Post()
    async create(@Body() data: CreateCategoryDto): Promise<Category> {
        return await this.categoryService.create({
            name: data.name,
            slug: slug(`${data.name}-${Date.now()}`),
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Category> {
        const category = await this.categoryService.findOne(+id);

        if (category) {
            return category;
        }

        throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryService.update(+id, {
            ...data,
            slug: slug(`${data.name}-${Date.now()}`),
        });

        if (category) {
            return category;
        }

        throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        const category = await this.categoryService.remove(+id);

        if (category) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        }

        throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
    }
}
