import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
    return Response.json({ success: true, orders });
  } catch (error) {
    console.error("User orders fetch error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
