import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production"
);

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  const payload = await verifyAuth();
  if (payload) {
    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
      },
    };
  }
  return null;
}
