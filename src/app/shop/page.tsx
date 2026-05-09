"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";

export default function ShopPage() {
  const { products, categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "name">("name");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <main className="min-h-screen bg-[#FBF7F0]">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#FAD65F] via-[#F8C93A] to-[#F0A500] text-[#0A4027] py-16 border-b border-[#E7B93A]/40">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="text-[#0A4027]">Shop</span>{" "}<span className="text-[#7A4D00]">All Products</span>
          </h1>
          <p className="text-xl text-[#3A5333] opacity-95">
            Discover fresh, organic agricultural products directly from farmers
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-[#FFF8E4] rounded-2xl p-6 shadow-[0_12px_30px_rgba(120,88,0,0.08)] border border-[#E7B93A]/30 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#7A4D00] mb-2 uppercase tracking-wider">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 text-[#0A4027] border-2 border-[#E7B93A]/45 rounded-xl focus:outline-none focus:border-[#F0A500] focus:ring-4 focus:ring-[#F0A500]/15 placeholder:text-[#81917C] transition"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-[#7A4D00] mb-3 uppercase tracking-wider text-sm">Categories</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? "bg-[#F0A500] text-[#0A4027] shadow-sm"
                      : "hover:bg-[#F0A500]/10 text-[#0A4027]"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors mt-2 ${
                      selectedCategory === cat.id
                        ? "bg-[#F0A500] text-[#0A4027] shadow-sm"
                        : "hover:bg-[#F0A500]/10 text-[#0A4027]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold text-[#7A4D00] mb-2 uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/90 text-[#0A4027] border-2 border-[#E7B93A]/45 rounded-xl focus:outline-none focus:border-[#F0A500] focus:ring-4 focus:ring-[#F0A500]/15 transition"
                >
                  <option value="name">Product Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-lg font-semibold text-[#0A4027]">
                Showing {filteredProducts.length} products
                {selectedCategory && ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="relative h-32 sm:h-48 bg-gradient-to-br from-[#FCD860] to-[#F0A500] overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">{product.emoji || "🌾"}</div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-sm sm:text-base text-[#0A4027] mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-grow">
                        {product.description || "Fresh agricultural product"}
                      </p>

                      {/* Price & Stock */}
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-2xl font-bold text-[#F0A500]">
                          ₹{product.price}
                        </span>
                        <span
                          className={`text-[10px] sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full ${
                            product.stock! > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock! > 0 ? `In Stock` : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-[#0A4027] mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or category filters
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
