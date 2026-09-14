import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashedPassword, name: "Admin" },
  });
  console.log("Admin ready");

  const projects = [
    {
      title: "Lamborghini Spec Edit",
      slug: "lamborghini-spec-edit",
      description:
        "A cinematic spec commercial for Lamborghini, showcasing the raw power and elegance of the Aventador through dynamic camera work and precise editing.",
      category: "Spec Ads",
      client: "Lamborghini (Spec)",
      year: 2024,
      role: "Director of Photography & Editor",
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: "Commercial Product Film",
      slug: "commercial-product-film",
      description:
        "A high-end commercial product film for a luxury brand, focusing on product storytelling and cinematic lighting.",
      category: "Commercial",
      client: "Luxury Brand X",
      year: 2023,
      role: "Cinematographer & Editor",
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: "Social Media Campaign",
      slug: "social-media-campaign",
      description:
        "A punchy social media campaign delivering short-form video content optimized for Instagram and TikTok.",
      category: "Social Media",
      client: "Demo Client",
      year: 2024,
      role: "Creative Director & Editor",
      featured: false,
      published: true,
      order: 3,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log("Projects seeded");

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        { title: "Cinematography", description: "Cinematic storytelling through purposeful camera work, lighting and movement.", order: 1 },
        { title: "Video Editing", description: "Precise editing that shapes narrative flow, pacing and visual rhythm.", order: 2 },
        { title: "Commercial Production", description: "Full production pipeline from concept to final delivery for brands and agencies.", order: 3 },
        { title: "Creative Direction", description: "Guiding the visual and narrative vision of a project from start to finish.", order: 4 },
      ],
    });
    console.log("Services seeded");
  }

  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({
      data: {
        aboutBio:
          "I am a creative professional specializing in cinematography, videography and video editing. I tell stories through motion, light and rhythm.",
        aboutSkills: JSON.stringify(["Cinematography", "Video Editing", "Creative Direction", "Color Grading"]),
        aboutTools: JSON.stringify(["Adobe Premiere Pro", "DaVinci Resolve", "Adobe After Effects", "Sony FX6"]),
        aboutEmail: "joseph@example.com",
        aboutPhone: "+2348000000000",
        contactEmail: "joseph@example.com",
        contactPhone: "+2348000000000",
        whatsappNumber: "+2348000000000",
      },
    });
    console.log("SiteSettings seeded");
  }

  const themeCount = await prisma.themeSettings.count();
  if (themeCount === 0) {
    await prisma.themeSettings.create({ data: { mode: "dark" } });
    console.log("Theme seeded");
  }

  console.log("\nSeeding complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
