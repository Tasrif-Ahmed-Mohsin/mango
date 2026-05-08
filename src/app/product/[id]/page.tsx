"use client";
import { useCart } from "../../../../src/context/CartContext";
import { useData } from "../../../../src/context/DataContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { products, categories } = useData();
  const product = products.find((p: any) => p.id === id);
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (!product) return <div className="p-16 text-center text-2xl font-extrabold text-[#0A4027]">Product not found</div>;
  
  const categoryIcon = categories.find((c: any) => c.id === product.categoryId)?.icon || "📦";

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <Link href="/" className="text-[#3A5333] hover:text-[#F0A500] mb-8 inline-block font-semibold text-sm transition">
        &larr; Back to Market
      </Link>
      
      <div className="bg-white rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col md:flex-row reveal anim-fade-up">
        <div className="md:w-1/2 bg-[#E3E8CD] flex items-center justify-center py-24 border-b md:border-b-0 md:border-r border-[#C4CCAF] relative overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-80 object-contain p-8" />
          ) : (
            <span className="text-9xl">{product.emoji || categoryIcon}</span>
          )}
        </div>
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <span className="text-[#F0A500] text-sm font-bold mb-4 block tracking-tight">Farm Fresh</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11311F] mb-4 leading-tight tracking-tight">{product.name}</h1>
          <p className="text-sm text-[#3A5333] font-semibold mb-8">Sourced directly from: {product.farmer}</p>
          
          <div className="w-12 h-1 bg-[#C4CCAF] mb-8"></div>
          
          <p className="text-[#3A5333] text-lg mb-10 leading-relaxed font-medium">{product.description}</p>
          
          <div className="flex items-center gap-6 mb-10">
            <div className="text-5xl font-extrabold text-[#F0A500]">
              ${product.price}
            </div>
            <div className="text-[#3A5333] font-medium">
              per {product.unit}
            </div>
          </div>
          
          <div className="flex gap-4">
              <button 
                onClick={() => addToCart(product.id, 1)}
                className="flex-1 bg-[#FCD860] text-[#0A4027] py-4 rounded-full font-bold text-sm hover:bg-[#F0A500] transition shadow-md"
              >
                Add to Basket
              </button>
              <div className="px-6 py-4 rounded-full border border-gray-200 text-[#3A5333] font-semibold text-sm flex items-center justify-center">
                Stock: {product.stock}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}