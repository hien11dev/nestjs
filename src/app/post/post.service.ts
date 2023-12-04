import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/libs/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.PostCreateInput | Prisma.PostUncheckedCreateInput): Promise<Post> {
    return await this.prisma.post.create({ data });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany({});
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.PostUpdateInput | Prisma.PostUncheckedUpdateInput): Promise<Post | null> {
    return await this.prisma.post.update({ data: data, where: { id } });
  }

  async remove(id: number): Promise<Post | null> {
    return await this.prisma.post.delete({ where: { id } });
  }
}
