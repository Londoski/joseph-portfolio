import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const p = schema.safeParse(await req.json());
    if (!p.success) return NextResponse.json({ error: "Invalid URL or platform" }, { status: 400 });
    const item = await prisma.socialLink.create({ data: { ...p.data, icon: p.data.icon || null } });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}