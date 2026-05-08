"use client";
import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0A4027] to-[#0d5a37] text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="text-white">About</span>{" "}<span className="text-[#FCD860]">AgriCommerce</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Connecting farmers directly to consumers for fresh, organic agricultural products
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#0A4027] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              AgriCommerce is revolutionizing agriculture by connecting farmers directly with consumers. 
              We eliminate middlemen, ensuring farmers get fair prices while customers receive fresh, 
              quality products at competitive rates.
            </p>
            <p className="text-lg text-gray-700">
              Our platform empowers rural communities, promotes sustainable farming practices, 
              and makes organic produce accessible to everyone.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#FCD860] to-[#F0A500] rounded-lg p-8 flex items-center justify-center min-h-80">
            <div className="text-9xl">🌾</div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0A4027] mb-12 text-center" style={{ fontFamily: "'Fraunces', serif" }}>Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fair Pricing",
                description:
                  "We ensure farmers receive fair compensation for their hard work while keeping prices affordable for customers.",
                icon: "💰",
              },
              {
                title: "Quality & Freshness",
                description:
                  "Every product on our platform meets strict quality standards and is delivered fresh directly from farms.",
                icon: "✨",
              },
              {
                title: "Sustainability",
                description:
                  "We promote eco-friendly farming practices and sustainable agriculture for a better future.",
                icon: "🌱",
              },
            ].map((value, index) => (
              <div key={index} className="bg-[#FBF7F0] rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-[#0A4027] mb-4">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[#0A4027] to-[#0d5a37] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "500+", label: "Farmers" },
              { stat: "50,000+", label: "Happy Customers" },
              { stat: "200+", label: "Products" },
              { stat: "25", label: "States" },
            ].map((item, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{item.stat}</div>
                <div className="text-lg opacity-90">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-[#0A4027] mb-12 text-center" style={{ fontFamily: "'Fraunces', serif" }}>How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Browse",
              description: "Explore a wide variety of fresh agricultural products",
            },
            {
              step: "2",
              title: "Select",
              description: "Choose your favorite products and add to cart",
            },
            {
              step: "3",
              title: "Checkout",
              description: "Complete your purchase securely online",
            },
            {
              step: "4",
              title: "Deliver",
              description: "Receive fresh products directly at your doorstep",
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-[#0A4027] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-[#0A4027] mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
              {index < 3 && (
                <div className="hidden md:block absolute top-6 -right-3 text-3xl text-[#FCD860]">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#FCD860] to-[#F0A500] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#0A4027] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Start Shopping Now</h2>
          <p className="text-xl text-[#0A4027] mb-8 opacity-90">
            Join thousands of customers enjoying fresh, quality products directly from farmers
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#0A4027] text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform"
          >
            Browse Products →
          </Link>
        </div>
      </section>
    </main>
  );
}
