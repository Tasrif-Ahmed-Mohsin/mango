"use client";
import { useCart } from "../../../../src/context/CartContext";
import { useData } from "../../../../src/context/DataContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { products, categories, refreshData } = useData();
  const product = products.find((p: any) => p.id === id);
  const { addToCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  
  // Reviews state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (!product) return <div className="p-16 text-center text-2xl font-extrabold text-[#0A4027]">Product not found</div>;
  
  const category = categories.find((c: any) => c.id === product.categoryId);
  const categoryIcon = category?.icon || "📦";
  const categoryName = category?.name || "General";

  const handleAddToCart = () => {
    const stock = product.stock ?? 0;
    if (quantity > stock) {
      toast.error(`Only ${stock} items left in stock!`);
      return;
    }
    addToCart(product.id, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
    setQuantity(1); // Reset quantity
  };

  const handleIncrement = () => {
    const stock = product.stock ?? 0;
    if (quantity < stock) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted successfully!");
        setReviewComment("");
        setReviewRating(5);
        await refreshData();
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (err) {
      toast.error("An error occurred while submitting review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-[#81917C] font-semibold mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-[#F0A500] transition">Home</Link>
          </li>
          <li><div className="flex items-center"><span className="mx-2">/</span><Link href="/shop" className="hover:text-[#F0A500] transition">Shop</Link></div></li>
          <li><div className="flex items-center"><span className="mx-2">/</span><span className="text-[#3A5333]">{categoryName}</span></div></li>
          <li aria-current="page"><div className="flex items-center"><span className="mx-2">/</span><span className="text-[#0A4027] truncate max-w-[150px] sm:max-w-xs">{product.name}</span></div></li>
        </ol>
      </nav>
      
      {/* Product Top Section */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-[#EAE3D5] overflow-hidden flex flex-col lg:flex-row mb-12">
        {/* Image Container */}
        <div className="lg:w-1/2 bg-[#FDFCF8] flex items-center justify-center py-20 border-b lg:border-b-0 lg:border-r border-[#EAE3D5] relative overflow-hidden group">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-96 object-contain p-8 transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <span className="text-[12rem] transition-transform duration-500 group-hover:scale-110">{product.emoji || categoryIcon}</span>
          )}
          {isOutOfStock && (
            <div className="absolute top-6 right-6 bg-[#B04132] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
              Sold Out
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-6 right-6 bg-[#F0A500] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
              Only {product.stock} Left!
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <span className="text-[#F0A500] text-sm font-bold mb-3 block tracking-wider uppercase">Farm Fresh • {categoryName}</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#11311F] mb-4 leading-tight tracking-tight">{product.name}</h1>
          <p className="text-sm text-[#81917C] font-semibold mb-6 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Sourced directly from: <span className="text-[#3A5333] underline decoration-[#C4CCAF] underline-offset-4">{product.farmer}</span>
          </p>
          
          <p className="text-[#3A5333] text-lg mb-8 leading-relaxed font-medium">{product.description}</p>
          
          <div className="flex items-end gap-3 mb-8">
            <div className="text-5xl font-extrabold text-[#F0A500]">৳{product.price}</div>
            <div className="text-[#81917C] font-semibold mb-2">per {product.unit}</div>
          </div>
          
          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border-2 border-[#EAE3D5] rounded-full px-4 h-14 sm:w-1/3">
              <button onClick={handleDecrement} disabled={isOutOfStock} className="text-[#2A4026] hover:text-[#F0A500] p-2 disabled:opacity-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span className="font-bold text-lg text-[#0A4027]">{isOutOfStock ? 0 : quantity}</span>
              <button onClick={handleIncrement} disabled={isOutOfStock || quantity >= stock} className="text-[#2A4026] hover:text-[#F0A500] p-2 disabled:opacity-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
            
            {/* Add Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 h-14 rounded-full font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-[#FAD65F] text-[#0A4027] hover:bg-[#E7B93A] hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {isOutOfStock ? "Out of Stock" : "Add to Basket"}
            </button>
          </div>

          {/* Shipping Accordion */}
          <div className="border border-[#EAE3D5] rounded-2xl overflow-hidden">
            <button 
              onClick={() => setShowShippingInfo(!showShippingInfo)}
              className="w-full flex justify-between items-center p-5 bg-[#FDFCF8] hover:bg-[#FAF7F0] transition-colors text-left"
            >
              <span className="font-bold text-[#2A4026] flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Shipping & Returns Policy
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 text-[#81917C] ${showShippingInfo ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${showShippingInfo ? 'max-h-40 border-t border-[#EAE3D5]' : 'max-h-0'}`}>
              <div className="p-5 bg-white text-sm text-[#5A6D55] leading-relaxed">
                <p className="mb-2"><strong>Next Day Delivery:</strong> Available for orders placed before 8 PM.</p>
                <p><strong>Returns:</strong> 100% freshness guarantee. If you are not satisfied with the quality of the produce, we offer a no-questions-asked refund within 24 hours of delivery.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EAE3D5]">
        <h2 className="text-2xl font-serif font-bold text-[#11311F] mb-8 flex items-center gap-3">
          Customer Reviews 
          <span className="bg-[#EAE3D5] text-[#2A4026] text-sm py-1 px-3 rounded-full">{product.reviews?.length || 0}</span>
        </h2>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Write a Review */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-[#EAE3D5] lg:pr-12 pb-8 lg:pb-0">
            <h3 className="text-lg font-bold text-[#2A4026] mb-4">Write a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5A6D55] mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= reviewRating ? 'text-[#F0A500]' : 'text-[#D4CFC3]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5A6D55] mb-2">Your Comment</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you think of this product?"
                  className="w-full border border-[#D4CFC3] rounded-xl p-3 focus:outline-none focus:border-[#F0A500] text-sm text-[#2A4026]"
                  rows={4}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingReview}
                className="w-full bg-[#2A4026] hover:bg-[#11311F] text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-6">
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#FDFCF8] border border-dashed border-[#C4CCAF] rounded-2xl">
                <span className="text-4xl mb-3">🌱</span>
                <p className="text-[#5A6D55] font-medium">Be the first to review this farm-fresh product!</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {[...product.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((review: any, i: number) => (
                  <div key={i} className="border-b border-[#EAE3D5] pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-[#11311F]">{review.name}</p>
                        <div className="flex text-[#F0A500] text-sm mt-1">
                          {[...Array(5)].map((_, idx) => (
                            <span key={idx}>{idx < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-[#81917C] font-medium">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#5A6D55] leading-relaxed mt-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}