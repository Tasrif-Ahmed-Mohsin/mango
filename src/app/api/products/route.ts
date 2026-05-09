import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { readDB, writeDB } from "@/lib/jsonDb";

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const products = await Product.find();
      return Response.json({ success: true, products });
    } else {
      const localData = await readDB();
      return Response.json({ success: true, products: localData.products });
    }
  } catch (error) {
    console.error("Products fetch error:", error);
    const localData = await readDB();
    return Response.json({ success: true, products: localData.products });
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const db = await connectDB();

    if (db) {
      const product = new Product(productData);
      await product.save();
      return Response.json({ success: true, message: "Product created", product });
    } else {
      const localData = await readDB();
      localData.products.push(productData);
      await writeDB(localData);
      return Response.json({ success: true, message: "Product created (saved to server JSON)", product: productData });
    }
  } catch (error) {
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await connectDB();

    if (db) {
      await Product.deleteOne({ id });
      return Response.json({ success: true, message: "Product deleted" });
    } else {
      const localData = await readDB();
      localData.products = localData.products.filter((p: any) => p.id !== id);
      await writeDB(localData);
      return Response.json({ success: true, message: "Product deleted (from server JSON)" });
    }
  } catch (error) {
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

