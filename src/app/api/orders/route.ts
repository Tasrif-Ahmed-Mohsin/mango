import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    await connectDB();
    
    const order = new Order(orderData);
    await order.save();

    return Response.json({
      success: true,
      message: "Order created successfully",
      orderId: orderData.orderId,
    });
  } catch (error) {
    console.error("Order create error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return Response.json({ success: true, orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

