import { PrismaService } from '@/libs/prisma.service';
import { LengthPaginate } from '@/utils/length-paginate';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import * as slug from 'slug';
import { FindAllPostDto } from './dto/find-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostPaginate } from './entities/post.entity';

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.PostCreateInput | Prisma.PostUncheckedCreateInput): Promise<Post> {
        return await this.prisma.post
            .create({
                data,
                include: {
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
                },
            })
            .then((post) => {
                return post;
            });
    }

    async findAll(query: FindAllPostDto): Promise<PostPaginate> {
        const whereOption: Prisma.PostWhereInput = {};
        if (query.author) {
            whereOption.author_id = query.author;
        }

        if (query.category) {
            whereOption.categories = { some: { category_id: { in: query.category } } };
        }

        const { page, skip, take } = new LengthPaginate(query);

        const [total, posts] = await Promise.all([
            this.prisma.post.count({ where: whereOption }),
            this.prisma.post.findMany({
                where: whereOption,
                orderBy: {
                    created_at: 'desc',
                },
                skip,
                take,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
        ]);

        return new PostPaginate(posts, page, take, total);
    }

    async findOne(id: number, include: Prisma.PostInclude = {}): Promise<Post | null> {
        return await this.prisma.post.findUnique({
            where: { id },
            include,
        });
    }

    async update(id: number, data: UpdatePostDto, authorId: number): Promise<Post | null> {
        const categories = await this.prisma.categoryPost.findMany({
            where: {
                post_id: id,
            },
            select: {
                category_id: true,
            },
        });

        const categoryIds = categories.map((category) => category.category_id);

        const media = await this.prisma.media.findMany({
            where: {
                post_id: id,
            },
            select: {
                path: true,
            },
        });

        const mediaPaths = media.map((media) => media.path);

        try {
            return await this.prisma.post.update({
                data: {
                    title: data.title,
                    description: data.description,
                    slug: slug(`${data.title}-${Date.now()}`),
                    media: {
                        create: data.media
                            .filter((path) => !mediaPaths.includes(path))
                            .map((path) => ({
                                path,
                            })),
                        deleteMany: {
                            path: {
                                notIn: data.media,
                            },
                        },
                    },
                    categories: {
                        connect: data.categories
                            .filter((category) => !categoryIds.includes(category))
                            .map((category) => ({
                                category_id_post_id: {
                                    category_id: category,
                                    post_id: id,
                                },
                            })),
                        deleteMany: {
                            post_id: id,
                            category_id: {
                                notIn: data.categories,
                            },
                        },
                    },
                },
                where: { id, author_id: authorId },
                include: {
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
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(error.meta?.cause || 'Record to update does not exist.', HttpStatus.NOT_FOUND);
            }

            return null;
        }
    }

    async remove(id: number): Promise<Post | null> {
        try {
            return await this.prisma.post.delete({ where: { id } });
        } catch (error) {
            console.log('error: ', error);
            if (error.code === 'P2025') {
                throw new HttpException(error.meta?.cause || 'Record to delete does not exist.', HttpStatus.NOT_FOUND);
            }

            return null;
        }
    }
}
