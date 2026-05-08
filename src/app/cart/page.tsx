"use client";
import { useCart } from "../../context/CartContext";
import { useData } from "../../context/DataContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();
  const { products } = useData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const cartItems = items.map(item => {
    const product = products.find((p: any) => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const total = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center max-w-2xl bg-white mt-12 rounded-[2.5rem] border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] reveal anim-fade-up visible">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-3xl font-extrabold text-[#0A4027] mb-4 tracking-tight">Your Basket is Empty</h1>
        <p className="text-[#3A5333] mb-8 font-medium">Explore our premium selection of organic products.</p>
        <Link href="/" className="inline-block bg-[#FCD860] text-[#0A4027] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#F0A500] transition shadow-md">Return to Market</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold text-[#0A4027] tracking-wide reveal anim-fade-up delay-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          <span className="text-[#0A4027]">Your</span>{" "}<span className="text-[#F0A500]">Basket</span>
        </h1>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden reveal anim-fade-up delay-100">
        <div className="max-h-[600px] overflow-y-auto">
          {cartItems.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-6 p-6 border-b border-gray-100 last:border-0 hover:bg-[#FBF7F0] transition">
              <div className="w-20 h-20 bg-[#E3E8CD] rounded-2xl flex items-center justify-center text-4xl shrink-0">
                {item.product?.emoji || "📦"}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl text-[#0A4027] tracking-tight">{item.product!.name}</h3>
                <p className="text-[#3A5333] text-sm font-medium">{item.product!.farmer}</p>
              </div>
              <div className="text-center">
                <span className="block text-sm text-[#3A5333] font-medium">Quantity</span>
                <span className="font-bold text-[#0A4027] text-lg">{item.quantity}</span>
              </div>
              <div className="text-center w-24">
                <span className="block text-sm text-[#3A5333] font-medium">Total</span>
                <span className="font-bold text-[#F0A500] text-xl">₹{(item.product!.price * item.quantity).toFixed(2)}</span>
              </div>
              <button 
                onClick={() => removeFromCart(item.productId)} 
                className="text-[#F0A500] hover:text-[#D26900] text-sm font-semibold border border-[#F0A500] rounded-full px-4 py-1.5 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="p-8 bg-[#FBF7F0] flex flex-col md:flex-row justify-between items-center border-t border-gray-100 gap-6">
          <button 
            onClick={clearCart} 
            className="text-[#3A5333] text-sm font-bold hover:text-[#0A4027] transition"
          >
            Clear Basket
          </button>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="block text-sm text-[#3A5333] font-medium mb-1">Estimated Total</span>
              <span className="text-4xl font-extrabold text-[#0A4027]">₹{total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="inline-block bg-[#FCD860] text-[#0A4027] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#F0A500] transition shadow-md">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}