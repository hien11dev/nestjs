import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoryDto } from './dto/find-all-category.dto';
import { Category } from '@prisma/client';
import { Response } from 'express';
import { CategoryPaginate } from './entities/category.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async findAll(@Query() query: FindAllCategoryDto): Promise<CategoryPaginate> {
    console.log('query: ', query);
    return this.categoryService.findAll(query.name, query.page, query.limit);
  }

  @Post()
  async create(@Body() data: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCategoryDto): Promise<Category> {
    return await this.categoryService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.categoryService.remove(+id);
    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
