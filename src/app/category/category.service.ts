import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma.service';
import { LengthPaginate } from 'src/utils/length-paginate';
import { FindAllCategoryDto } from './dto/find-all-category.dto';
import { CategoryPaginate } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return await this.prisma.category.create({ data });
    }

    async findAll(query: FindAllCategoryDto): Promise<CategoryPaginate> {
        const whereNameOption: Prisma.CategoryWhereInput = {};

        if (typeof query.name === 'string' && query.name.length > 0) {
            whereNameOption.name = { contains: query.name };
        }

        const { page, skip, take } = new LengthPaginate(query);

        const [total, categories] = await Promise.all([
            this.prisma.category.count({ where: whereNameOption }),
            this.prisma.category.findMany({
                where: whereNameOption,
                orderBy: {
                    name: 'asc',
                },
                skip,
                take,
            }),
        ]);

        return new CategoryPaginate(categories, page, take, total);
    }

    async findOne(id: number): Promise<Category | null> {
        return await this.prisma.category.findUnique({ where: { id } });
    }

    async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category | null> {
        try {
            return await this.prisma.category.update({ where: { id }, data });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(error.meta?.cause || 'Record to update does not exist.', HttpStatus.NOT_FOUND);
            }

            return null;
        }
    }

    async remove(id: number): Promise<Category | null> {
        try {
            return await this.prisma.category.delete({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(error.meta?.cause || 'Record to delete does not exist.', HttpStatus.NOT_FOUND);
            }

            return null;
        }
    }
}
