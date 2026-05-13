import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { verifyAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().select('-__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, s-maxage=60',
    });

    return new Response(JSON.stringify({ success: true, products, pagination: { total, page, limit, pages: Math.ceil(total / limit) } }), { headers });
  } catch (error) {
    console.error("Products fetch error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authPayload = await verifyAuth();
    if (!authPayload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawData = await request.json();
    const parseResult = productSchema.safeParse(rawData);

    if (!parseResult.success) {
      return Response.json({ error: "Validation failed", details: parseResult.error.issues }, { status: 400 });
    }

    const productData = parseResult.data;
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
  } catch (error: any) {
    console.error("Product create error:", error);
    const message = error?.message || JSON.stringify(error) || "Failed to create product";
    return Response.json({ error: message }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const authPayload = await verifyAuth();
    if (!authPayload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    
    if (!id || typeof id !== 'string') {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();
    const result = await Product.deleteOne({ id });
    if (!result.deletedCount) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Product delete error:", error);
    return Response.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}


