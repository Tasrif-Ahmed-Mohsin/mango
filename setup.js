const fs = require('fs');
const path = require('path');

const dataContextCode = `"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories as initialCategories, products as initialProducts } from '../data/mockData';

export type Category = { id: string, name: string, description: string, icon: string, image?: string };
export type Product = { id: string, categoryId: string, name: string, price: number, description: string, stock: number, unit: string, farmer: string, image?: string };

type DataContextType = {
  categories: Category[];
  products: Product[];
  addCategory: (c: Category) => void;
  addProduct: (p: Product) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCats = localStorage.getItem('agri_categories');
    const savedProds = localStorage.getItem('agri_products');
    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedProds) setProducts(JSON.parse(savedProds));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
        localStorage.setItem('agri_categories', JSON.stringify(categories));
    }
  }, [categories, mounted]);

  useEffect(() => {
    if (mounted) {
        localStorage.setItem('agri_products', JSON.stringify(products));
    }
  }, [products, mounted]);

  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);

  return (
    <DataContext.Provider value={{ categories, products, addCategory, addProduct }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
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
      icon: catIcon || "🛒"
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category Name</label>
              <input required value={catName} onChange={e => setCatName(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Jackfruit" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea required value={catDesc} onChange={e => setCatDesc(e.target.value)} className="w-full border p-2 rounded" placeholder="Category description" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Icon/Emoji (e.g. 🍉)</label>
              <input required value={catIcon} onChange={e => setCatIcon(e.target.value)} className="w-full border p-2 rounded" placeholder="🍉" />
            </div>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">Add Category</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Product Name</label>
              <input required value={prodName} onChange={e => setProdName(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Raw Jackfruit" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select required value={prodCat} onChange={e => setProdCat(e.target.value)} className="w-full border p-2 rounded">
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price ($)</label>
                <input required type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Stock</label>
                <input required type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Unit</label>
                <input required value={prodUnit} onChange={e => setProdUnit(e.target.value)} className="w-full border p-2 rounded" placeholder="kg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Farmer/Farm Name</label>
              <input required value={prodFarmer} onChange={e => setProdFarmer(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Green Valley Farm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea required value={prodDesc} onChange={e => setProdDesc(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">Add Product</button>
          </form>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 border-b pb-2">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-bold text-lg mb-2">Categories ({categories.length})</h3>
          <ul className="list-disc pl-5">
            {categories.map((c: any) => <li key={c.id}>{c.icon} {c.name}</li>)}
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-bold text-lg mb-2">Products ({products.length})</h3>
          <ul className="list-disc pl-5">
            {products.map((p: any) => <li key={p.id}>{p.name} (\${p.price}/{p.unit})</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}`;

const layoutCode = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { DataProvider } from "../context/DataContext";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriCommerce - Farm to Table",
  description: "Fresh agricultural products directly from farmers to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataProvider>
          <CartProvider>
            <header className="bg-green-700 text-white p-4 sticky top-0 z-50 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                  🌾 AgriCommerce
                </Link>
                <nav className="flex gap-6 items-center border-l border-green-600 pl-6">
                  <Link href="/admin" className="font-semibold text-green-200 hover:text-white transition">⚙️ Admin</Link>
                  <Link href="/cart" className="flex items-center gap-2 font-semibold hover:text-green-200">
                    🛒 Cart
                  </Link>
                </nav>
              </div>
            </header>
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-green-900 text-green-200 p-6 text-center mt-12 border-t border-green-800">
              <p>&copy; 2026 AgriCommerce. All rights reserved.</p>
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

  if (!mounted) return null; // prevent hydration mismatch

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <div>
      <section className="bg-green-100 py-16 px-4">
        <div className="container mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 mb-4">
            Fresh Farm Products
          </h1>
          <p className="text-xl text-green-800 max-w-2xl mx-auto">
            From our farms to your doorstep — fresh, organic, trusted.
          </p>
        </div>

        <div className="container mx-auto flex flex-wrap justify-center gap-3 mb-8">
          <button 
            onClick={() => setActiveCategory("all")}
            className={\`px-6 py-2 rounded-full font-bold transition \${activeCategory === "all" ? "bg-green-700 text-white" : "bg-white text-green-800 hover:bg-green-200 shadow-sm"}\`}
          >
            All Fresh Picks
          </button>
          {categories.map((c: any) => (
            <button 
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={\`px-6 py-2 rounded-full font-bold transition \${activeCategory === c.id ? "bg-green-700 text-white" : "bg-white text-green-800 hover:bg-green-200 shadow-sm"}\`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition flex flex-col">
              <Link href={\`/product/\${p.id}\`} className="block group mb-3 text-center">
                <div className="h-32 bg-green-50 rounded-lg mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                  {categories.find((c: any) => c.id === p.categoryId)?.icon || "🛒"}
                </div>
                <h3 className="font-bold text-xl text-gray-800 hover:text-green-700 transition">{p.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mb-3 text-center">{p.farmer}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="font-extrabold text-green-700 text-lg">\${p.price}/{p.unit}</span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(p.id, 1);
                  }}
                  className="bg-green-600 text-white text-sm px-3 py-2 rounded font-semibold hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 border-b pb-4">Our Specialties</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-5xl mx-auto">
          <Link href="/category/mangoes" className="md:w-1/2 bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-8 flex items-center justify-between hover:shadow-lg transition">
            <div>
              <span className="text-sm font-bold text-yellow-600 uppercase tracking-wider mb-1 block">⭐ Signature Product</span>
              <h3 className="text-4xl font-extrabold text-yellow-900 mb-2">Mangoes</h3>
              <p className="text-yellow-800">The king of fruits, naturally ripened and sweet.</p>
            </div>
            <div className="text-8xl">🥭</div>
          </Link>

          <div className="md:w-1/2 flex flex-col gap-4 justify-center">
            {categories.filter((c: any) => c.id !== "mangoes").map((c: any) => (
              <Link key={c.id} href={\`/category/\${c.id}\`} className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4 hover:bg-green-100 hover:border-green-200 transition">
                <div className="text-4xl">{c.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">{c.name}</h3>
                  <p className="text-sm text-green-700">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-green-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden text-sm md:text-base">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4 hidden md:table-cell">Price</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                <td className="p-4 font-semibold">{item.product!.name}</td>
                <td className="p-4 hidden md:table-cell">\${item.product!.price}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4 font-bold">\${(item.product!.price * item.quantity).toFixed(2)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center border-t gap-4">
          <button onClick={clearCart} className="text-gray-600 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition w-full md:w-auto">Clear Cart</button>
          <div className="text-right w-full md:w-auto flex justify-between md:justify-end items-center gap-4">
            <span className="text-gray-600 font-semibold">Total:</span>
            <span className="text-2xl font-extrabold text-green-700">\${total.toFixed(2)}</span>
            <button className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition">Checkout</button>
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
  if (!product) return <div className="p-8 text-center text-2xl">Product not found</div>;
  
  const categoryIcon = categories.find((c: any) => c.id === product.categoryId)?.icon || "🛒";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="text-green-600 hover:underline mb-8 inline-block font-semibold">&larr; Back to Shop</Link>
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-green-50 flex items-center justify-center text-9xl py-16">
          {categoryIcon}
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-green-900 mb-2">{product.name}</h1>
          <p className="text-sm text-green-600 font-bold mb-6 uppercase tracking-wider">Farm: {product.farmer}</p>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.description}</p>
          <div className="text-4xl font-extrabold text-green-800 mb-2">
            \${product.price} <span className="text-xl text-gray-500 font-medium">/ {product.unit}</span>
          </div>
          <p className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded w-max mb-8 font-semibold">
            Stock: {product.stock} available
          </p>
          <button 
            onClick={() => addToCart(product.id, 1)}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-green-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Add to Cart
          </button>
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

  if (!category) return <div className="p-8 text-center text-2xl">Category not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-green-600 hover:underline mb-8 inline-block font-semibold">&larr; Home</Link>
      <div className="flex items-center gap-4 mb-10">
        <span className="text-6xl">{category.icon}</span>
        <div>
          <h1 className="text-4xl font-extrabold text-green-900">{category.name}</h1>
          <p className="text-gray-600 text-lg mt-1">{category.description}</p>
        </div>
      </div>
      
      {categoryProducts.length === 0 ? (
        <p className="text-gray-500 italic">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((p: any) => (
             <div key={p.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-5 flex flex-col hover:shadow-lg transition">
              <h3 className="font-bold text-xl mb-1 text-gray-800">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{p.description}</p>
              
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="font-extrabold text-green-700 text-xl">\${p.price}</span>
                  <span className="text-sm text-gray-500">/{p.unit}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
                  {p.farmer}
                </span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <Link href={\`/product/\${p.id}\`} className="flex-1 bg-gray-100 text-gray-800 text-center py-2.5 rounded font-semibold hover:bg-gray-200 transition text-sm">
                  View details
                </Link>
                <button onClick={() => addToCart(p.id, 1)} className="flex-1 bg-green-600 text-white py-2.5 rounded font-bold hover:bg-green-700 transition text-sm flex items-center justify-center gap-1">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

fs.mkdirSync('src/context', { recursive: true });
fs.mkdirSync('src/app/admin', { recursive: true });
fs.mkdirSync('src/app/product/[id]', { recursive: true });

fs.writeFileSync('src/context/DataContext.tsx', dataContextCode);
fs.writeFileSync('src/app/admin/page.tsx', adminPageCode);
fs.writeFileSync('src/app/layout.tsx', layoutCode);
fs.writeFileSync('src/app/page.tsx', pageCode);
fs.writeFileSync('src/app/cart/page.tsx', cartPageCode);
fs.writeFileSync('src/app/category/[id]/page.tsx', categoryPageCode);
fs.writeFileSync('src/app/product/[id]/page.tsx', productPageCode);

console.log('Setup finished');