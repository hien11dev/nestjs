import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, Res, HttpException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { ProfileEntity } from './entities/profile.entity';
import { User } from '@prisma/client';

@Controller('profile')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  async getProfile(@Req() request: Request): Promise<ProfileEntity> {
    const id = +request.user.id;
    const user = await this.profileService.findOne(id);
    return new ProfileEntity(user);
  }

  @Patch()
  async update(@Req() req: Request, @Body() data: UpdateProfileDto) {
    const user: User = req.user;
    const isUnique = await this.profileService.validateUniqueEmail(user.email, data.email);
    if (isUnique) {
      const userUpdate = await this.profileService.update(+user.id, data);
      return new ProfileEntity(userUpdate);
    }

    throw new HttpException('The email alrealy exists', HttpStatus.BAD_REQUEST)
  }

  @Delete()
  async remove(@Req() req: Request, @Res() res: Response) {
    await this.profileService.remove(+req.user.id);
    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
