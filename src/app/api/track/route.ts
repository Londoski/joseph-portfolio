import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path : null;

    if (!path || path.length > 500) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Skip admin, api, and asset paths
    if (
      path.startsWith("/admin") ||
      path.startsWith("/api") ||
      path.startsWith("/_next") ||
      path.startsWith("/icons") ||
      path.endsWith(".png") ||
      path.endsWith(".jpg") ||
      path.endsWith(".svg") ||
      path.endsWith(".ico")
    ) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Try to link to a project if the path is /work/[slug]
    let projectId: string | null = null;
    const workMatch = path.match(/^\/work\/([^/?]+)/);
    if (workMatch) {
      const project = await prisma.project.findUnique({
        where: { slug: workMatch[1] },
        select: { id: true },
      });
      if (project) projectId = project.id;
    }

    const referrer = req.headers.get("referer") || null;
    const userAgent = req.headers.get("user-agent") || null;

    await prisma.pageView.create({
      data: {
        path,
        projectId,
        referrer,
        userAgent: userAgent ? userAgent.slice(0, 500) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}