import { PrismaClient } from '@prisma/client';
import categorySeeder from './seeders/category.seeder';
import userSeeder from './seeders/user.seeder';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    await userSeeder(prisma);

    await categorySeeder(prisma);

    console.log(`Seeding finished.`);
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });
