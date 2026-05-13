import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Require user to be logged in to review
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return Response.json({ error: "You must be logged in to leave a review." }, { status: 401 });
    }

    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return Response.json({ error: "Please provide a valid rating between 1 and 5." }, { status: 400 });
    }

    if (!comment || comment.trim().length < 3) {
      return Response.json({ error: "Please provide a review comment (minimum 3 characters)." }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findOne({ id: resolvedParams.id });

    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews?.find(
      (r: any) => r.userId.toString() === (session.user as any).id.toString()
    );

    if (alreadyReviewed) {
      return Response.json({ error: "You have already reviewed this product." }, { status: 400 });
    }

    const review = {
      userId: (session.user as any).id,
      name: session.user.name || "Anonymous User",
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    if (!product.reviews) {
      product.reviews = [];
    }
    
    product.reviews.push(review);
    await product.save();

    return Response.json({ success: true, message: "Review added successfully", review });
  } catch (error: any) {
    console.error("Failed to add review:", error);
    return Response.json({ error: error.message || "Failed to add review" }, { status: 500 });
  }
}
