import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production"
);

// Hardcoded admin credentials for now (replace with DB in production)
const ADMIN_CREDENTIALS = {
  email: "admin@agricommerce.com",
  password: "admin123", // In production, use hashed password!
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Verify credentials
    if (
      email !== ADMIN_CREDENTIALS.email ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

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
