import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authPayload = await verifyAuth();
    if (!authPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Upload: BLOB_READ_WRITE_TOKEN present?", !!process.env.BLOB_READ_WRITE_TOKEN);
    console.log("Upload file:", file.name, file.size, file.type);

    // Try Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log("Using Vercel Blob storage...");
        const blob = await put(file.name, file, {
          access: "public",
        });
        console.log("Blob uploaded successfully:", blob.url);
        return NextResponse.json({ url: blob.url, success: true });
      } catch (blobError: any) {
        console.error("Blob upload failed:", blobError?.message);
        throw new Error(`Vercel Blob error: ${blobError?.message}`);
      }
    }

    // On Vercel production without Blob token, filesystem is read-only
    const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.error("BLOB_READ_WRITE_TOKEN not configured on production");
      return NextResponse.json({ 
        error: "Image uploads not configured. Please set up Vercel Blob Storage with BLOB_READ_WRITE_TOKEN environment variable." 
      }, { status: 503 });
    }

    // Fallback to local storage for local development only
    console.warn("Using local storage for development only");
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

