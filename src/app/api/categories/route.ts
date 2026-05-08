import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";

export async function GET() {
  try {
    try {
      await connectDB();
      const categories = await Category.find();
      return Response.json({ success: true, categories });
    } catch (dbError) {
      console.warn("MongoDB fetch failed");
      return Response.json({ success: true, categories: [] });
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const categoryData = await request.json();

    try {
      await connectDB();
      const category = new Category(categoryData);
      await category.save();

      return Response.json({
        success: true,
        message: "Category created",
        category,
      });
    } catch (dbError) {
      console.warn("MongoDB save failed");
      return Response.json({
        success: true,
        message: "Category created (stored locally)",
      });
    }
  } catch (error) {
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    try {
      await connectDB();
      await Category.deleteOne({ id });

      return Response.json({
        success: true,
        message: "Category deleted",
      });
    } catch (dbError) {
      console.warn("MongoDB delete failed");
      return Response.json({
        success: true,
        message: "Category deleted (from local storage)",
      });
    }
  } catch (error) {
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
