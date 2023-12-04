import { Module } from '@nestjs/common';
import { IsUniqueConstraint } from 'src/libs/class-validator/is-unique';
import { PrismaService } from 'src/libs/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    controllers: [CategoryController],
    providers: [CategoryService, PrismaService, IsUniqueConstraint, JwtStrategy],
})
export class CategoryModule {}
