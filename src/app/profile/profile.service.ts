import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (user) {
            return user;
        }

        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (user) {
            return user;
        }

        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        try {
            return await this.prisma.user.update({
                data,
                where: {
                    id,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(error.meta?.cause || 'Record to update does not exist.', HttpStatus.NOT_FOUND);
            }

            return null;
        }
    }

    async remove(id: number): Promise<User> {
        try {
            return await this.prisma.user.delete({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(error.meta?.cause || 'Record to delete does not exist.', HttpStatus.NOT_FOUND);
            }

            return null;
        }
    }

    async validateUniqueEmail(oldEmail: string, newEmail: string): Promise<boolean> {
        if (oldEmail === newEmail) {
            return true;
        }

        return (
            (await this.prisma.user.count({
                where: {
                    email: {
                        equals: newEmail,
                        not: oldEmail,
                    },
                },
            })) === 0
        );
    }
}
