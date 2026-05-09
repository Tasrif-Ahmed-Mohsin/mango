import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().select('-__v').sort({ createdAt: -1 });

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600, s-maxage=7200',
    });

    return new Response(JSON.stringify({ success: true, categories }), { headers });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const categoryData = await request.json();
    await connectDB();
    
    // Check if category exists (using the custom 'id' field)
    const existing = await Category.findOne({ id: categoryData.id });
    if (existing) {
      Object.assign(existing, categoryData);
      await existing.save();
      return Response.json({ success: true, message: "Category updated", category: existing });
    }

    const category = new Category(categoryData);
    await category.save();
    return Response.json({ success: true, message: "Category created", category });
  } catch (error) {
    console.error("Category create error:", error);
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await Category.deleteOne({ id });
    return Response.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Category delete error:", error);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}


