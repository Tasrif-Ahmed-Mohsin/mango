import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return Response.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
