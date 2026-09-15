import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  projectType: z.string().optional().default(""),
  budgetRange: z.string().optional().default(""),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form and try again." },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        projectType: parsed.data.projectType || null,
        budgetRange: parsed.data.budgetRange || null,
        message: parsed.data.message,
      },
    });

    // Send email notification (non-blocking, errors are logged)
    sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      projectType: parsed.data.projectType || null,
      budgetRange: parsed.data.budgetRange || null,
      message: parsed.data.message,
    }).catch((err) => {
      console.error("Notification error:", err);
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}