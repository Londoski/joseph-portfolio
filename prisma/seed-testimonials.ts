import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.testimonial.count();
  if (count > 0) {
    console.log(`Skipping — already have ${count} testimonials`);
    return;
  }

  const samples = [
    {
      clientName: "Adaeze Okonkwo",
      company: "Lagos Fashion Week",
      role: "Creative Producer",
      content:
        "Joseph brought a cinematic quality to our runway coverage that we hadn't seen before. Every frame felt intentional, every cut had rhythm. He elevated the entire production.",
      order: 1,
      published: true,
    },
    {
      clientName: "Emeka Nwosu",
      company: "Apex Motors",
      role: "Marketing Director",
      content:
        "Working with Joseph on our campaign was seamless. He understood the brief immediately and delivered a spec edit that outperformed the reference we gave him. Highly recommended.",
      order: 2,
      published: true,
    },
    {
      clientName: "Sophie Chen",
      company: "Vibrant Studios",
      role: "Brand Manager",
      content:
        "Joseph's eye for detail is unmatched. He turned a simple product shoot into a story people actually wanted to watch. The final cut exceeded every expectation.",
      order: 3,
      published: true,
    },
  ];

  for (const t of samples) {
    await prisma.testimonial.create({ data: t });
  }

  console.log(`Created ${samples.length} sample testimonials`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });