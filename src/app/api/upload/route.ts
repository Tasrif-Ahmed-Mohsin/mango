import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Upload: BLOB_READ_WRITE_TOKEN present?", !!process.env.BLOB_READ_WRITE_TOKEN);
    console.log("Upload file:", file.name, file.size, file.type);

    // Use Vercel Blob if token is available (Production/Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("Using Vercel Blob storage...");
      const blob = await put(file.name, file, {
        access: "public",
      });
      console.log("Blob uploaded successfully:", blob.url);
      return NextResponse.json({ url: blob.url, success: true });
    }

    // Fallback to local storage for local development
    console.warn("BLOB_READ_WRITE_TOKEN not found, falling back to local storage");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const filename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const publicPath = `/uploads/${filename}`;
    console.log("Local upload successful:", publicPath);
    return NextResponse.json({ url: publicPath, success: true });
  } catch (error: any) {
    console.error("Upload error:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}

