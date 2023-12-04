import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/libs/prisma.service';
import { IsUniqueConstraint } from 'src/libs/class-validator/is-unique';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, IsUniqueConstraint]
})
export class CategoryModule { }
