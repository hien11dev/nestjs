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
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { Request, Response } from 'express';
import * as slug from 'slug';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { FindAllPostDto } from './dto/find-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostPaginate } from './entities/post.entity';
import { PostService } from './post.service';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    async create(@Body() data: CreatePostDto, @Req() req: Request): Promise<PostModel> {
        return this.postService.create({
            author_id: req.user.id,
            title: data.title,
            description: data.description,
            slug: slug(`${data.title}-${Date.now()}`),
            categories: {
                create: data.categories.map((category_id) => ({
                    category_id,
                })),
            },
            media: {
                create: data.media.map((path) => ({
                    path,
                })),
            },
        });
    }

    @Get()
    async findAll(@Query() query: FindAllPostDto): Promise<PostPaginate> {
        return await this.postService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PostModel> {
        const post = await this.postService.findOne(+id, {
            author: {
                select: {
                    id: true,
                    name: true,
                },
            },
            categories: {
                include: {
                    category: true,
                },
            },
            media: true,
        });
        if (!post) {
            throw new HttpException('The post not found.', HttpStatus.NOT_FOUND);
        }

        return post;
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdatePostDto, @Req() req: Request) {
        const user = req.user;
        return this.postService.update(+id, data, user.id);
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
