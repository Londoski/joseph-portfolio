import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";



const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEOS = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/ogg"];

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;  // 15 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB


export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const kind = (form.get("kind") as string) || "image"; // "image" | "video"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGES.includes(file.type);
    const isVideo = ALLOWED_VIDEOS.includes(file.type);

    if (kind === "image" && !isImage) {
      return NextResponse.json(
        { error: "Invalid image type. Allowed: JPG, PNG, WEBP, GIF, AVIF" },
        { status: 400 }
      );
    }

    if (kind === "video" && !isVideo) {
      return NextResponse.json(
        { error: "Invalid video type. Allowed: MP4, WEBM, MOV, AVI, OGG" },
        { status: 400 }
      );
    }

    const maxSize = kind === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${kind === "video" ? "500MB" : "15MB"}.` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", kind === "video" ? "videos" : "images");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${kind === "video" ? "videos" : "images"}/${filename}`;

    return NextResponse.json({
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}