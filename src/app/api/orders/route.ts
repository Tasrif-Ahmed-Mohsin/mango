import { connectDB } from "@/lib/mongodb";
import { Order, Product } from "@/lib/models";
import { verifyAuth } from "@/lib/auth";
import { orderSchema } from "@/lib/validation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    const parseResult = orderSchema.safeParse(rawData);

    if (!parseResult.success) {
      return Response.json({ error: "Validation failed", details: parseResult.error.issues }, { status: 400 });
    }

    const orderData = parseResult.data as any;
    
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    if (session && session.user && (session.user as any).id) {
      orderData.userId = (session.user as any).id;
    }

    await connectDB();
    
    // 1. Atomically decrement stock for all items
    // Since MongoDB without replica sets doesn't fully support multi-document transactions easily,
    // we do it item by item. In a production system with replica sets, use a session.
    const reservedItems = [];
    let stockError = null;

    for (const item of orderData.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Item out of stock or doesn't exist
        stockError = `Not enough stock for product: ${item.name}`;
        break;
      }
      reservedItems.push(item);
    }

    // 2. If any item failed, rollback the already reserved items
    if (stockError) {
      for (const item of reservedItems) {
        await Product.findOneAndUpdate(
          { id: item.productId },
          { $inc: { stock: item.quantity } }
        );
      }
      return Response.json({ error: stockError }, { status: 400 });
    }

    // 3. Create the order since stock was successfully reserved
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
    const authPayload = await verifyAuth();
    if (!authPayload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return Response.json({ success: true, orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

