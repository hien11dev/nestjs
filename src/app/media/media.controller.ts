import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get('avatar')
    async getAvatarPresignedURLs() {
        return this.mediaService.getAvatarPresignedURL();
    }

    @Get('post')
    @UseGuards(JwtAuthGuard)
    async getPostPresignedURLs() {
        return this.mediaService.getPostPresignedURL();
    }
}
