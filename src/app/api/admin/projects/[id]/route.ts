import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const existing = await prisma.project.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  const project = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      client: body.client || null,
      year: body.year ? Number(body.year) : null,
      role: body.role || null,
      thumbnail: body.thumbnail || null,
      videoUrl: body.videoUrl || null,
      gallery: body.gallery || null,
      featured: !!body.featured,
      published: body.published !== false,
      order: Number(body.order) || 0,
      slug: finalSlug,
    },
  });
  return NextResponse.json(project);
}