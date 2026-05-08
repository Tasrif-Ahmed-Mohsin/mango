import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split(".").pop() || "png";
    const filename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Write file
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const publicPath = `/uploads/${filename}`;
    return NextResponse.json({ url: publicPath, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
