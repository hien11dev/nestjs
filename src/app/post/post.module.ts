import { Module } from '@nestjs/common';
import { IsExistsConstraint } from 'src/libs/class-validator/is-exist';
import { PrismaService } from 'src/libs/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    controllers: [PostController],
    providers: [PostService, IsExistsConstraint, PrismaService, JwtStrategy],
})
export class PostModule {}
