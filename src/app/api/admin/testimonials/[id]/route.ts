import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";



const schema = z.object({
  clientName: z.string().min(2),
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  content: z.string().min(10),
  image: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const p = schema.safeParse(await req.json());
    if (!p.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const item = await prisma.testimonial.create({
      data: {
        ...p.data,
        company: p.data.company || null,
        role: p.data.role || null,
        image: p.data.image || null,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}