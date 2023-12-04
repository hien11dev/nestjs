import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/libs/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { CategoryPaginate, categoryPaginateResponse } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async findAll(name: string, page: number = 1, limit: number = 10): Promise<CategoryPaginate> {
    const whereNameOption = {
      ...(name ? {
        name: {
          contains: name
        }
      } : {})
    };

    const count = await this.prisma.category.count({ where: whereNameOption });
    if (count > 0) {
      const categories: Category[] = await this.prisma.category.findMany({
        where: whereNameOption,
        orderBy: {
          name: 'asc'
        },
        skip: page > 1 ? (page - 1) * limit : 0,
        take: limit
      });
      return categoryPaginateResponse(categories, page, limit, count);
    }

    return categoryPaginateResponse([], page, limit, 0);
  }

  async findOne(id: number): Promise<Category> {
    return await this.prisma.category.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return await this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Category> {
    return await this.prisma.category.delete({ where: { id } });
  }
}
