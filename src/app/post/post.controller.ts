import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpException, HttpStatus, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { Post as PostModel } from '@prisma/client';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  async create(@Body() data: CreatePostDto, @Req() req: Request): Promise<PostModel> {
    return this.postService.create({
      authorId: req.user.id,
      title: data.title,
      description: data.description,
      categories: {
        connect: [...(new Set(data.categories))].map((categoryId) => ({
          categoryId_postId: categoryId,
        }))
      },
      media: {
        create: data.media.map((path) => ({
          path
        }))
      }
    });
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostModel> {
    const post = await this.postService.findOne(+id);
    if (!post) {
      throw new HttpException('The post not found.', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePostDto, @Req() req: Request) {
    return this.postService.update(+id, {
      authorId: req.user.id,
      title: data.title,
      description: data.description,
      categories: {
        connect: data.categories.map((categoryId) => ({
          categoryId_postId: categoryId,
        }))
      },
      media: {
        create: data.media.map((path) => ({
          path
        }))
      }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postService.remove(+id);
    if (!post) {
      throw new HttpException('The post not found.', HttpStatus.NOT_FOUND);
    }

    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
