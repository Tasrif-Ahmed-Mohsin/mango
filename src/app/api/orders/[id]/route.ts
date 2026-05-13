import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const authPayload = await verifyAuth();
    if (!authPayload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();
    if (!["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ orderId: resolvedParams.id });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Release stock if order is cancelled
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        // We import Product here to avoid circular dependency issues at top level if any
        const { Product } = await import("@/lib/models");
        await Product.findOneAndUpdate(
          { id: item.productId },
          { $inc: { stock: item.quantity } }
        );
      }
    }

    order.status = status;
    await order.save();

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("Order update error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
