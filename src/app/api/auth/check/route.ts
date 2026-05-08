import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await verifyAuth();
    
    if (!payload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
      },
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
