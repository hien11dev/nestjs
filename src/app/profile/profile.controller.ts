import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Put,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    async getProfile(@Req() request: Request): Promise<ProfileEntity> {
        const id = +request.user.id;
        const user = await this.profileService.findOne(id);
        return new ProfileEntity(user);
    }

    @Put()
    async update(@Req() req: Request, @Body() data: UpdateProfileDto) {
        const user: User = req.user;
        const isUnique = await this.profileService.validateUniqueEmail(user.email, data.email);
        if (isUnique) {
            const userUpdate = await this.profileService.update(+user.id, data);
            return new ProfileEntity(userUpdate);
        }

        throw new HttpException('Email already exists.', HttpStatus.BAD_REQUEST);
    }

    @Delete()
    async remove(@Req() req: Request, @Res() res: Response) {
        await this.profileService.remove(+req.user.id);
        res.sendStatus(HttpStatus.NO_CONTENT);
    }
}
