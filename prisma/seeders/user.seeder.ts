import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export default async function (prisma: PrismaClient, limit = 100) {
    const data: Prisma.UserCreateInput[] = await Promise.all([
        ...new Array(limit).fill(0).map(
            async (_, index: number) =>
                <Prisma.UserCreateInput>{
                    id: index + 1,
                    active: !!(limit % index),
                    avatar: faker.image.avatar(),
                    email: faker.internet.email().toLowerCase(),
                    name: faker.person.fullName(),
                    password: await bcrypt.hash(faker.internet.password(), 10),
                    email_verified_at: faker.date.recent(),
                    created_at: faker.date.recent(),
                    updated_at: faker.date.recent(),
                },
        ),
    ]);
    return await prisma.user.createMany({
        data,
        skipDuplicates: true,
    });
}
