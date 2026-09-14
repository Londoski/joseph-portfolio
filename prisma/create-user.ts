import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "josephchimaobi28@gmail.com";
  const password = "admin123";
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name: "Joseph" },
    create: { email, password: hashed, name: "Joseph" },
  });

  console.log(`User ready: ${email}`);
  console.log(`Password:   ${password}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });