import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production"
);

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    // Basic rate limiting by IP (using x-forwarded-for if behind proxy, or remote addr)
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    
    let rateData = rateLimitMap.get(ip);
    if (!rateData || now > rateData.resetTime) {
      rateData = { count: 0, resetTime: now + WINDOW_MS };
    }
    
    if (rateData.count >= MAX_ATTEMPTS) {
      return Response.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
    }

    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@agricommerce.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Verify credentials
    if (
      email !== adminEmail ||
      password !== adminPassword
    ) {
      rateData.count += 1;
      rateLimitMap.set(ip, rateData);
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Successful login, clear rate limit
    rateLimitMap.delete(ip);

    // Create JWT token
    const token = await new SignJWT({
      id: "admin-1",
      email: email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
