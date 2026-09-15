import { NextResponse } from "next/server";
import { sendPushToAdmins } from "@/lib/push";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendPushToAdmins({
    title: "Test Notification",
    body: "If you see this, push notifications are working!",
    url: "/admin/messages",
    tag: "test",
  });

  return NextResponse.json(result);
}