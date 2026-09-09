import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        password: 'thejd12',
      },
    });
    console.log('Admin password seeded successfully.');
  } else {
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { password: 'thejd12' },
    });
    console.log('Admin password updated successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
