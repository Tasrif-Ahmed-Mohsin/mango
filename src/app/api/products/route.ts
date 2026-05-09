import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return Response.json({ success: true, products });
  } catch (error) {
    console.error("Products fetch error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    await connectDB();

    // Check if product exists (using the custom 'id' field)
    const existing = await Product.findOne({ id: productData.id });
    if (existing) {
      Object.assign(existing, productData);
      await existing.save();
      return Response.json({ success: true, message: "Product updated", product: existing });
    }

    const product = new Product(productData);
    await product.save();
    return Response.json({ success: true, message: "Product created", product });
  } catch (error) {
    console.error("Product create error:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await Product.deleteOne({ id });
    return Response.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Product delete error:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}


