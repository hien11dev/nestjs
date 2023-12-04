import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

export default async function (prisma: PrismaClient, limit = 100) {
    return await prisma.category.createMany({
        data: new Array(limit).fill(0).map(
            (_, index) =>
                <Prisma.CategoryCreateInput>{
                    id: index + 1,
                    name: 'Category ' + (index + 1),
                    slug: 'category-' + (index + 1),
                    created_at: faker.date.recent(),
                    updated_at: faker.date.recent(),
                },
        ),
        skipDuplicates: true,
    });
}
