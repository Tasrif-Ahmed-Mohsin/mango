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
      <section className="bg-gradient-to-r from-[#0A4027] to-[#0d5a37] text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="text-white">Shop</span>{" "}<span className="text-[#FCD860]">All Products</span>
          </h1>
          <p className="text-xl opacity-90">
            Discover fresh, organic agricultural products directly from farmers
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#0A4027] mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-[#0A4027] mb-3">Categories</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? "bg-[#0A4027] text-white"
                      : "hover:bg-[#0A4027]/10"
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
                        ? "bg-[#0A4027] text-white"
                        : "hover:bg-[#0A4027]/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold text-[#0A4027] mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-[#FCD860] to-[#F0A500] overflow-hidden flex items-center justify-center">
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
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-[#0A4027] mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {product.description || "Fresh agricultural product"}
                      </p>

                      {/* Price & Stock */}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-[#F0A500]">
                          ₹{product.price}
                        </span>
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${
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
