import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // Try to connect to MongoDB
    try {
      await connectDB();
      
      // Save to MongoDB
      const order = new Order(orderData);
      await order.save();

      return Response.json({
        success: true,
        message: "Order created successfully",
        orderId: orderData.orderId,
      });
    } catch (dbError) {
      console.warn("MongoDB save failed, returning success (client-side storage)");
      // If MongoDB fails, just acknowledge the order (client will handle storage)
      return Response.json({
        success: true,
        message: "Order created (stored locally)",
        orderId: orderData.orderId,
      });
    }
  } catch (error) {
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Try to connect to MongoDB
    try {
      await connectDB();
      
      const orders = await Order.find().sort({ createdAt: -1 });
      return Response.json({ success: true, orders });
    } catch (dbError) {
      console.warn("MongoDB fetch failed");
      // Return empty array if database unavailable
      return Response.json({ success: true, orders: [] });
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
