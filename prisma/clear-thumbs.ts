import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.updateMany({
    data: { thumbnail: null, gallery: null },
  });
  console.log("Cleared broken thumbnails");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
