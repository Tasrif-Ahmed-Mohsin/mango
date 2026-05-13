"use client";
import { useCart } from "../../../context/CartContext";
import { useData } from "../../../context/DataContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { categories, products } = useData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  // show server-rendered content immediately; use `mounted` to trigger client-only effects
  
  const category = categories.find((c: any) => c.id === id);
  const categoryProducts = products.filter((p: any) => p.categoryId === id);
  const { addToCart } = useCart();

  if (!category) return <div className="p-16 text-center text-2xl font-extrabold text-[#0A4027]">Category not found</div>;

  return (
    <div className="container mx-auto px-6 py-16">
      <Link href="/" className="text-[#3A5333] hover:text-[#F0A500] mb-12 inline-block font-semibold text-sm transition">
        &larr; Back to Market
      </Link>
      
      <div className="flex flex-col items-center justify-center text-center mb-16 bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] reveal anim-fade-up">
        {category.image ? (
          <img src={category.image} alt={category.name} className="w-32 h-32 object-contain mb-6 drop-shadow-lg" />
        ) : (
          <span className="text-8xl mb-6">{category.icon}</span>
        )}
        <h1 className="text-5xl font-extrabold text-[#0A4027] mb-4 tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>{category.name}</h1>
        <p className="text-[#3A5333] text-lg max-w-2xl font-medium">{category.description}</p>
      </div>
      
      {categoryProducts.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-[#3A5333] text-lg font-medium">No products currently available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryProducts.map((p: any, pi: number) => (
             <div key={p.id} style={{ animationDelay: `${pi * 80}ms` }} className="group relative rounded-[2rem] p-1.5 transition-all duration-500 bg-white hover:bg-gradient-to-b hover:from-[#F0A500] hover:to-[#D26900] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(210,105,0,0.3)] flex flex-col border border-gray-100 hover:border-transparent reveal anim-fade-up">
                <Link href={`/product/${p.id}`} className="block flex-grow flex flex-col">
                  <div className="relative rounded-[1.7rem] overflow-hidden mb-4 aspect-[4/3] bg-gray-50 group-hover:bg-white/10 transition-colors duration-300 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-500">{p.emoji || "📦"}</span>
                    )}
                  </div>
                  <div className="px-3.5 pb-2.5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-white transition-colors duration-300 leading-tight line-clamp-1 tracking-tight">{p.name}</h3>
                      <div className="bg-gray-900 group-hover:bg-black/30 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors duration-300 shrink-0">
                        ৳{p.price.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 group-hover:text-white/90 transition-colors duration-300 line-clamp-2 mb-4 leading-relaxed font-medium">
                      {p.description || `Fresh and organic ${p.name} sourced directly from farms.`}
                    </p>
                    <button 
                      onClick={(e) => { e.preventDefault(); addToCart(p.id, 1); }}
                      className="w-full py-3.5 rounded-full bg-[#FCD860] group-hover:bg-white text-[#0A4027] group-hover:text-[#A85800] font-bold text-[13px] transition-all duration-300 shadow-sm group-hover:shadow-md mt-auto"
                    >
                      Add to cart
                    </button>
                  </div>
                </Link>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}