const fs = require('fs');
const path = require('path');

const layoutCode = `import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { DataProvider } from "../context/DataContext";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "AgriCommerce - Organic Premium",
  description: "Fresh agricultural products directly from farmers to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\`\${inter.variable} \${lora.variable} font-sans bg-[#FAF7F0] text-[#2A4026]\`}>
        <DataProvider>
          <CartProvider>
            {/* Top Bar */}
            <div className="bg-[#B04132] text-[#F9F5EC] text-xs py-1 px-4 text-center font-medium tracking-widest uppercase">
              Farm Fresh • Organic Delivery • Support Local Farmers
            </div>
            
            {/* Main Header */}
            <header className="bg-[#FDFBF7] sticky top-0 z-50 shadow-sm border-b border-[#E5DFD1]">
              <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-serif font-bold text-[#2A4026] flex items-center gap-2 tracking-tight">
                  <span className="text-[#B04132]">Agri</span>Commerce
                </Link>
                <nav className="flex gap-8 items-center font-medium text-sm tracking-wide text-[#4A5D45]">
                  <Link href="/" className="hover:text-[#B04132] transition">Home</Link>
                  <Link href="/admin" className="hover:text-[#B04132] transition">Admin</Link>
                  <Link href="/cart" className="flex items-center gap-2 hover:text-[#B04132] transition">
                    <span className="text-lg">🛒</span> Cart
                  </Link>
                </nav>
              </div>
            </header>

            <main className="min-h-screen">
              {children}
            </main>

            <footer className="bg-[#1F331C] text-[#D8E0D5] py-12 text-center mt-16 border-t-4 border-[#B04132]">
              <div className="container mx-auto px-4">
                <p className="font-serif text-xl mb-4 text-[#F9F5EC]">AgriCommerce</p>
                <div className="flex justify-center gap-6 mb-6 text-sm">
                  <span className="hover:text-white cursor-pointer transition">About Us</span>
                  <span className="hover:text-white cursor-pointer transition">Organic Farms</span>
                  <span className="hover:text-white cursor-pointer transition">Delivery Policy</span>
                </div>
                <p className="text-xs opacity-60 uppercase tracking-widest">&copy; 2026 AgriCommerce. All rights reserved.</p>
              </div>
            </footer>
          </CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}`;

const pageCode = `"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useData } from "../context/DataContext";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { addToCart } = useCart();
  const { categories, products } = useData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 mb-16 border-b border-[#EAE3D5]">
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <h2 className="text-[#81917C] uppercase tracking-[0.2em] font-bold text-sm mb-4">Premium Farm Harvest</h2>
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-[#2A4026] mb-6 leading-tight">
            NATURE'S FINEST <br/> <span className="text-[#B04132]">FRESH GROCERIES</span>
          </h1>
          <p className="text-lg text-[#5A6D55] mb-10 w-2/3 mx-auto font-light leading-relaxed">
            Experience the rich, authentic taste of organic produce, carefully nurtured and delivered straight to your table.
          </p>
          <Link href="#shop" className="inline-block bg-[#B04132] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#8F3224] transition shadow-xl hover:-translate-y-1">
             Shop The Harvest
          </Link>
        </div>
        {/* Decorative elements simulating background in image */}
        <div className="absolute top-10 left-10 text-9xl opacity-20 transform -rotate-12 blur-sm">🌿</div>
        <div className="absolute bottom-10 right-10 text-9xl opacity-20 transform rotate-12 blur-sm">🍅</div>
      </section>

      {/* Specialty Featured Section */}
      <section className="container mx-auto px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#2A4026]">Featured Specialties</h2>
          <div className="w-16 h-1 mt-4 bg-[#B04132] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/category/mangoes" className="col-span-1 md:col-span-1 bg-[#FDFCF8] rounded-3xl p-8 shadow-sm border border-[#EAE3D5] hover:shadow-xl transition group duration-300 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-[#E9B134]"></div>
             <h3 className="font-serif text-2xl font-bold text-[#2A4026] mb-2">Premium Mangoes</h3>
             <p className="text-[#5A6D55] text-sm mb-8">The king of fruits.</p>
             <div className="flex justify-center text-8xl group-hover:scale-110 transition duration-500">🥭</div>
          </Link>
          <Link href="/category/vegetables" className="col-span-1 md:col-span-2 bg-[#FDFCF8] rounded-3xl p-8 shadow-sm border border-[#EAE3D5] hover:shadow-xl transition group duration-300 relative overflow-hidden flex items-center gap-8">
             <div className="absolute top-0 left-0 w-full h-2 bg-[#B04132]"></div>
             <div className="flex-1">
                 <h3 className="font-serif text-3xl font-bold text-[#2A4026] mb-2">Fresh Vegetables</h3>
                 <p className="text-[#5A6D55] mb-6">Crisp, green and loaded with nutrients. Sourced daily.</p>
                 <span className="text-[#B04132] font-semibold text-sm uppercase tracking-widest border-b border-[#B04132] pb-1">View Collection &rarr;</span>
             </div>
             <div className="text-9xl group-hover:scale-110 transition duration-500">🥬</div>
          </Link>
        </div>
      </section>

      {/* Main Products Area */}
      <section id="shop" className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[#2A4026] mb-4">Our Pantry</h2>
          <p className="text-[#81917C] text-sm tracking-widest uppercase mb-8">&sim;&sim; 🌿 &sim;&sim;</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setActiveCategory("all")}
              className={\`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition border \${activeCategory === "all" ? "bg-[#2A4026] text-[#F9F5EC] border-[#2A4026]" : "bg-transparent text-[#2A4026] border-[#D4CFC3] hover:bg-[#EAE3D5]"}\`}
            >
              ALL ITEMS
            </button>
            {categories.map((c: any) => (
              <button 
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={\`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition border \${activeCategory === c.id ? "bg-[#2A4026] text-[#F9F5EC] border-[#2A4026]" : "bg-transparent text-[#2A4026] border-[#D4CFC3] hover:bg-[#EAE3D5]"}\`}
              >
                 {c.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p: any) => (
            <div key={p.id} className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#EAE3D5] hover:shadow-xl transition flex flex-col group block">
              <Link href={\`/product/\${p.id}\`} className="block text-center flex-grow mb-6 relative">
                <div className="bg-[#FAF7F0] rounded-xl mb-6 py-10 flex items-center justify-center text-7xl group-hover:scale-105 transition duration-300">
                  {categories.find((c: any) => c.id === p.categoryId)?.icon || "📦"}
                </div>
                <div className="text-left">
                  <h3 className="font-serif font-bold text-xl text-[#2A4026] leading-tight mb-1">{p.name}</h3>
                  <p className="text-xs text-[#81917C] font-semibold tracking-wider uppercase mb-3">{p.farmer}</p>
                </div>
              </Link>
              <div className="flex justify-between items-center border-t border-[#EAE3D5] pt-4">
                <div className="font-bold text-[#B04132] text-xl">
                  \${p.price.toFixed(2)}<span className="text-sm font-normal text-[#81917C]">/{p.unit}</span>
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); addToCart(p.id, 1); }}
                  className="bg-[#2A4026] text-[#F9F5EC] px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-[#1F331C] transition duration-300 shadow-md"
                >
                  + ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}`;

const cartPageCode = `"use client";
import { useCart } from "../../context/CartContext";
import { useData } from "../../context/DataContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();
  const { products } = useData();

  const cartItems = items.map(item => {
    const product = products.find((p: any) => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const total = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center max-w-2xl bg-[#FDFCF8] mt-12 rounded-3xl border border-[#EAE3D5] shadow-sm">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-serif font-bold text-[#2A4026] mb-4">Your Basket is Empty</h1>
        <p className="text-[#81917C] mb-8 font-light">Explore our premium selection of organic products.</p>
        <Link href="/" className="inline-block bg-[#B04132] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#8F3224] transition shadow-lg">Return to Market</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#2A4026]">Your Basket</h1>
        <div className="flex-1 h-px bg-[#EAE3D5]"></div>
      </div>

      <div className="bg-[#FDFCF8] rounded-3xl shadow-sm border border-[#EAE3D5] overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          {cartItems.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-6 p-6 border-b border-[#EAE3D5] last:border-0 hover:bg-[#FAF7F0] transition">
              <div className="w-20 h-20 bg-[#F9F5EC] rounded-2xl flex items-center justify-center text-4xl shrink-0">
                📦
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif font-bold text-xl text-[#2A4026]">{item.product!.name}</h3>
                <p className="text-[#81917C] text-sm uppercase tracking-wide">{item.product!.farmer}</p>
              </div>
              <div className="text-center">
                <span className="block text-sm text-[#81917C] uppercase tracking-wide">Quantity</span>
                <span className="font-bold text-[#2A4026] text-lg">{item.quantity}</span>
              </div>
              <div className="text-center w-24">
                <span className="block text-sm text-[#81917C] uppercase tracking-wide">Total</span>
                <span className="font-bold text-[#B04132] text-xl">\${(item.product!.price * item.quantity).toFixed(2)}</span>
              </div>
              <button 
                onClick={() => removeFromCart(item.productId)} 
                className="text-[#B04132] hover:text-[#8F3224] text-sm font-semibold tracking-wide uppercase border border-[#B04132] rounded-full px-4 py-1.5 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="p-8 bg-[#FAF7F0] flex flex-col md:flex-row justify-between items-center border-t border-[#EAE3D5] gap-6">
          <button 
            onClick={clearCart} 
            className="text-[#5A6D55] text-sm font-bold tracking-wide uppercase hover:text-[#2A4026] transition"
          >
            Clear Basket
          </button>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="block text-sm text-[#81917C] uppercase tracking-wide mb-1">Estimated Total</span>
              <span className="text-4xl font-serif font-bold text-[#2A4026]">\${total.toFixed(2)}</span>
            </div>
            <button className="bg-[#B04132] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#8F3224] transition shadow-xl">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const productPageCode = `"use client";
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
  if (!product) return <div className="p-16 text-center text-2xl font-serif">Product not found</div>;
  
  const categoryIcon = categories.find((c: any) => c.id === product.categoryId)?.icon || "📦";

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <Link href="/" className="text-[#81917C] hover:text-[#B04132] mb-8 inline-block font-semibold uppercase tracking-widest text-xs transition">
        &larr; Back to Market
      </Link>
      
      <div className="bg-[#FDFCF8] rounded-3xl shadow-sm border border-[#EAE3D5] overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-[#FAF7F0] flex items-center justify-center text-9xl py-24 border-b md:border-b-0 md:border-r border-[#EAE3D5]">
          {categoryIcon}
        </div>
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <span className="text-[#B04132] text-sm font-bold uppercase tracking-widest mb-4 block">Farm Fresh</span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#2A4026] mb-4 leading-tight">{product.name}</h1>
          <p className="text-sm text-[#81917C] font-semibold mb-8 uppercase tracking-wider">Sourced directly from: {product.farmer}</p>
          
          <div className="w-12 h-1 bg-[#EAE3D5] mb-8"></div>
          
          <p className="text-[#5A6D55] text-lg mb-10 leading-relaxed font-light">{product.description}</p>
          
          <div className="flex items-center gap-6 mb-10">
            <div className="text-5xl font-serif font-bold text-[#B04132]">
              \${product.price}
            </div>
            <div className="text-[#81917C] font-medium tracking-wide">
              per {product.unit}
            </div>
          </div>
          
          <div className="flex gap-4">
              <button 
                onClick={() => addToCart(product.id, 1)}
                className="flex-1 bg-[#2A4026] text-[#F9F5EC] py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#1F331C] transition shadow-lg"
              >
                Add to Basket
              </button>
              <div className="px-6 py-4 rounded-full border border-[#D4CFC3] text-[#5A6D55] font-semibold text-sm flex items-center justify-center">
                Stock: {product.stock}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const categoryPageCode = `"use client";
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

  if (!mounted) return null;
  
  const category = categories.find((c: any) => c.id === id);
  const categoryProducts = products.filter((p: any) => p.categoryId === id);
  const { addToCart } = useCart();

  if (!category) return <div className="p-16 text-center text-2xl font-serif">Category not found</div>;

  return (
    <div className="container mx-auto px-6 py-16">
      <Link href="/" className="text-[#81917C] hover:text-[#B04132] mb-12 inline-block font-semibold uppercase tracking-widest text-xs transition">
        &larr; Back to Market
      </Link>
      
      <div className="flex flex-col items-center justify-center text-center mb-16 bg-[#FDFCF8] rounded-3xl p-12 border border-[#EAE3D5] shadow-sm">
        <span className="text-8xl mb-6">{category.icon}</span>
        <h1 className="text-5xl font-serif font-bold text-[#2A4026] mb-4">{category.name}</h1>
        <p className="text-[#5A6D55] text-lg max-w-2xl font-light">{category.description}</p>
      </div>
      
      {categoryProducts.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-[#81917C] text-lg font-light">No products currently available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryProducts.map((p: any) => (
             <div key={p.id} className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#EAE3D5] hover:shadow-xl transition flex flex-col group block">
                <div className="flex-grow">
                    <h3 className="font-serif font-bold text-xl text-[#2A4026] leading-tight mb-2">{p.name}</h3>
                    <span className="inline-block bg-[#FAF7F0] text-[#2A4026] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-[#EAE3D5]">
                        {p.farmer}
                    </span>
                    <p className="text-sm text-[#5A6D55] font-light mb-6 line-clamp-2">{p.description}</p>
                </div>
              
              <div className="flex justify-between items-center border-t border-[#EAE3D5] pt-4 mb-5">
                <div className="font-bold text-[#B04132] text-xl">
                  \${p.price.toFixed(2)}<span className="text-sm font-normal text-[#81917C]">/{p.unit}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href={\`/product/\${p.id}\`} className="flex-1 border border-[#2A4026] text-[#2A4026] text-center py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#FAF7F0] transition">
                  Details
                </Link>
                <button onClick={() => addToCart(p.id, 1)} className="flex-1 bg-[#2A4026] text-[#F9F5EC] py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#1F331C] transition shadow-md">Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

const adminPageCode = `"use client";
import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function AdminPage() {
  const { categories, products, addCategory, addProduct } = useData();

  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIcon, setCatIcon] = useState("");

  const [prodName, setProdName] = useState("");
  const [prodCat, setProdCat] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodUnit, setProdUnit] = useState("kg");
  const [prodFarmer, setProdFarmer] = useState("");

  const handleAddCategory = (e: any) => {
    e.preventDefault();
    addCategory({
      id: catName.toLowerCase().replace(/\\s+/g, '-'),
      name: catName,
      description: catDesc,
      icon: catIcon || "📦"
    });
    setCatName(""); setCatDesc(""); setCatIcon("");
  };

  const handleAddProduct = (e: any) => {
    e.preventDefault();
    addProduct({
      id: "p_" + Date.now(),
      categoryId: prodCat || (categories[0] ? categories[0].id : ""),
      name: prodName,
      price: parseFloat(prodPrice),
      description: prodDesc,
      stock: parseInt(prodStock),
      unit: prodUnit,
      farmer: prodFarmer
    });
    setProdName(""); setProdPrice(""); setProdDesc(""); setProdStock(""); setProdFarmer("");
  };

  const inputClass = "w-full border border-[#D4CFC3] bg-[#FDFCF8] text-[#2A4026] p-3 rounded-xl focus:outline-none focus:border-[#B04132] transition font-sans";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#5A6D55] mb-2";

  return (
    <div className="container mx-auto px-6 py-16 max-w-6xl">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#2A4026]">Market Admin</h1>
        <div className="flex-1 h-px bg-[#EAE3D5]"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-[#FDFCF8] p-8 rounded-3xl shadow-sm border border-[#EAE3D5]">
          <h2 className="text-2xl font-serif font-bold mb-8 text-[#B04132]">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex flex-col gap-6">
            <div>
              <label className={labelClass}>Category Name</label>
              <input required value={catName} onChange={e => setCatName(e.target.value)} className={inputClass} placeholder="e.g. Jackfruit" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea required value={catDesc} onChange={e => setCatDesc(e.target.value)} className={inputClass} placeholder="Category description" rows={3} />
            </div>
            <div>
              <label className={labelClass}>Icon/Emoji (e.g. 🍉)</label>
              <input required value={catIcon} onChange={e => setCatIcon(e.target.value)} className={inputClass} placeholder="🍉" />
            </div>
            <button type="submit" className="mt-4 bg-[#2A4026] text-[#F9F5EC] font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:bg-[#1F331C] transition shadow-md">Add Category</button>
          </form>
        </div>

        <div className="bg-[#FDFCF8] p-8 rounded-3xl shadow-sm border border-[#EAE3D5]">
          <h2 className="text-2xl font-serif font-bold mb-8 text-[#B04132]">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-6">
            <div>
              <label className={labelClass}>Product Name</label>
              <input required value={prodName} onChange={e => setProdName(e.target.value)} className={inputClass} placeholder="e.g. Raw Jackfruit" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select required value={prodCat} onChange={e => setProdCat(e.target.value)} className={inputClass}>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Price ($)</label>
                <input required type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock</label>
                <input required type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Unit</label>
                <input required value={prodUnit} onChange={e => setProdUnit(e.target.value)} className={inputClass} placeholder="kg" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Farm Name</label>
              <input required value={prodFarmer} onChange={e => setProdFarmer(e.target.value)} className={inputClass} placeholder="e.g. Green Valley Farm" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea required value={prodDesc} onChange={e => setProdDesc(e.target.value)} className={inputClass} rows={2} />
            </div>
            <button type="submit" className="mt-4 bg-[#2A4026] text-[#F9F5EC] font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:bg-[#1F331C] transition shadow-md">Add Product</button>
          </form>
        </div>
      </div>

      <div className="bg-[#FAF7F0] rounded-3xl p-10 border border-[#EAE3D5]">
        <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#2A4026]">System Overview</h2>
            <div className="flex-1 h-px bg-[#D4CFC3]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
            <h3 className="font-bold text-sm tracking-widest text-[#B04132] uppercase mb-4">Categories ({categories.length})</h3>
            <ul className="space-y-2">
                {categories.map((c: any) => <li key={c.id} className="bg-[#FDFCF8] px-4 py-2 border border-[#EAE3D5] rounded-xl text-sm font-medium text-[#2A4026] flex items-center gap-3"><span className="text-xl">{c.icon}</span> {c.name}</li>)}
            </ul>
            </div>
            <div>
            <h3 className="font-bold text-sm tracking-widest text-[#B04132] uppercase mb-4">Products ({products.length})</h3>
            <ul className="space-y-2">
                {products.map((p: any) => <li key={p.id} className="bg-[#FDFCF8] px-4 py-2 border border-[#EAE3D5] rounded-xl text-sm font-medium text-[#2A4026] flex justify-between"><span className="font-bold">{p.name}</span> <span className="text-[#81917C]">\${p.price.toFixed(2)}/{p.unit}</span></li>)}
            </ul>
            </div>
        </div>
      </div>
    </div>
  );
}`;

fs.writeFileSync('src/app/layout.tsx', layoutCode);
fs.writeFileSync('src/app/page.tsx', pageCode);
fs.writeFileSync('src/app/cart/page.tsx', cartPageCode);
fs.writeFileSync('src/app/category/[id]/page.tsx', categoryPageCode);
fs.writeFileSync('src/app/product/[id]/page.tsx', productPageCode);
fs.writeFileSync('src/app/admin/page.tsx', adminPageCode);

console.log('Premium theme applied successfully.');