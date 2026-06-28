import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test_insert_" + Date.now() + "@example.com",
        password: "test",
        name: "Test User",
        role: "user"
      }
    });
    console.log("Success! Created user with id:", user.id);
  } catch (err) {
    console.error("Prisma error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
