import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { readDB, writeDB } from "@/lib/jsonDb";

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const categories = await Category.find();
      return Response.json({ success: true, categories });
    } else {
      const localData = await readDB();
      return Response.json({ success: true, categories: localData.categories });
    }
  } catch (error) {
    console.error("Categories fetch error:", error);
    const localData = await readDB();
    return Response.json({ success: true, categories: localData.categories });
  }
}

export async function POST(request: Request) {
  try {
    const categoryData = await request.json();
    const db = await connectDB();

    if (db) {
      const category = new Category(categoryData);
      await category.save();
      return Response.json({ success: true, message: "Category created", category });
    } else {
      const localData = await readDB();
      localData.categories.push(categoryData);
      await writeDB(localData);
      return Response.json({ success: true, message: "Category created (saved to server JSON)", category: categoryData });
    }
  } catch (error) {
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await connectDB();

    if (db) {
      await Category.deleteOne({ id });
      return Response.json({ success: true, message: "Category deleted" });
    } else {
      const localData = await readDB();
      localData.categories = localData.categories.filter((c: any) => c.id !== id);
      localData.products = localData.products.filter((p: any) => p.categoryId !== id);
      await writeDB(localData);
      return Response.json({ success: true, message: "Category deleted (from server JSON)" });
    }
  } catch (error) {
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

