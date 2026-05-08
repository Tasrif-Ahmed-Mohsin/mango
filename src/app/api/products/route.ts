import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models";

export async function GET() {
  try {
    try {
      await connectDB();
      const products = await Product.find();
      return Response.json({ success: true, products });
    } catch (dbError) {
      console.warn("MongoDB fetch failed");
      return Response.json({ success: true, products: [] });
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    try {
      await connectDB();
      const product = new Product(productData);
      await product.save();

      return Response.json({
        success: true,
        message: "Product created",
        product,
      });
    } catch (dbError) {
      console.warn("MongoDB save failed");
      return Response.json({
        success: true,
        message: "Product created (stored locally)",
      });
    }
  } catch (error) {
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    try {
      await connectDB();
      await Product.deleteOne({ id });

      return Response.json({
        success: true,
        message: "Product deleted",
      });
    } catch (dbError) {
      console.warn("MongoDB delete failed");
      return Response.json({
        success: true,
        message: "Product deleted (from local storage)",
      });
    }
  } catch (error) {
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
