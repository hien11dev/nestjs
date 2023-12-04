import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/libs/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) { }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      data,
      where: {
        id
      }
    });
  }

  async remove(id: number): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }

  async validateUniqueEmail(oldEmail: string, newEmail: string): Promise<boolean> {
    if (oldEmail === newEmail) {
      return true;
    }

    return (await this.prisma.user.count({
      where: {
        email: {
          equals: newEmail,
          not: oldEmail
        }
      }
    })) === 0;
  }
}
