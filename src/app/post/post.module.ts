import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { IsExistsConstraint } from 'src/libs/class-validator/is-exist';
import { PrismaService } from 'src/libs/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PostService, IsExistsConstraint, PrismaService]
})
export class PostModule { }
