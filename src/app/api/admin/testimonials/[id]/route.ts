import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  clientName: z.string().min(2),
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  content: z.string().min(10),
  image: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const p = schema.safeParse(await req.json());
    if (!p.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const item = await prisma.testimonial.update({
      where: { id },
      data: {
        ...p.data,
        company: p.data.company || null,
        role: p.data.role || null,
        image: p.data.image || null,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}