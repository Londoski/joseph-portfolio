import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  client: z.string().optional().default(""),
  year: z.string().optional().transform((v) => (v && v !== "" ? Number(v) : null)),
  role: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  videoUrl: z.string().optional().default(""),
  gallery: z.string().optional().default(""),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const p = schema.safeParse(body);
    if (!p.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    let slug = slugify(p.data.title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const project = await prisma.project.create({
      data: {
        ...p.data,
        slug,
        client: p.data.client || null,
        role: p.data.role || null,
        thumbnail: p.data.thumbnail || null,
        videoUrl: p.data.videoUrl || null,
        gallery: p.data.gallery || null,
      },
    });
    return NextResponse.json(project);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}