import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../app/lib/prisma";

async function main() {
  const name = process.env.ADMIN_NAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !password) {
    throw new Error(
      "Set ADMIN_NAME and ADMIN_PASSWORD in .env before seeding the admin user."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { name },
    update: { passwordHash },
    create: { name, passwordHash },
  });

  console.log(`Admin user ready: ${admin.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
await prisma.$disconnect();
  });
