"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useData } from "@/context/DataContext";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { products } = useData();
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Calculate totals
  const cartProducts = items
    .map((item) => ({
      ...products.find((p) => p.id === item.productId),
      quantity: item.quantity,
    }))
    .filter((p) => p.id);

  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cartProducts.length === 0 && step !== "confirmation") {
    return (
      <main className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-[#0A4027] mb-4">Your cart is empty</h1>
          <Link
            href="/shop"
            className="inline-block bg-[#0A4027] text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      alert("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderId = "ORD-" + Date.now();
      const orderData = {
        orderId,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        items: cartProducts.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totals: {
          subtotal,
          shipping,
          tax,
          total,
        },
        status: "confirmed",
      };

      // Try to save to database
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
      } catch (apiError) {
        console.log("API call failed, but order will be saved locally");
      }

      // Also save to localStorage as fallback
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      setOrderId(orderId);
      clearCart();
      setStep("confirmation");
    } catch (error) {
      alert("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation Step
  if (step === "confirmation") {
    return (
      <main className="min-h-screen bg-[#FBF7F0]">
        <div className="container mx-auto px-6 py-20 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-7xl mb-6">✅</div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-[#0A4027]">Order</span>{" "}<span className="text-[#F0A500]">Confirmed!</span>
            </h1>
            <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>

            <div className="bg-[#FBF7F0] rounded-lg p-8 mb-8 text-left">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-xl font-bold text-[#0A4027]">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Total</p>
                  <p className="text-xl font-bold text-[#0A4027]">₹{total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="text-xl font-bold text-[#0A4027]">3-5 Days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-xl font-bold text-green-600">Confirmed</p>
                </div>
              </div>

              <hr className="my-6" />

              <div>
                <h3 className="font-bold text-[#0A4027] mb-4">Shipping Address</h3>
                <p className="text-gray-700">
                  {formData.firstName} {formData.lastName}
                  <br />
                  {formData.address}
                  <br />
                  {formData.city}, {formData.state} {formData.zip}
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-8">A confirmation email has been sent to <strong>{formData.email}</strong></p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-[#0A4027] text-white rounded-lg font-bold hover:scale-105 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3 border-2 border-[#0A4027] text-[#0A4027] rounded-lg font-bold hover:bg-[#0A4027]/5 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF7F0]">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="text-[#0A4027]">Check</span>{" "}<span className="text-[#F0A500]">out</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step !== "shipping" ? "bg-[#0A4027] text-white" : "bg-gray-300 text-gray-600"}`}>
              ✓
            </div>
            <div className={`flex-1 h-1 ${step === "payment" ? "bg-[#0A4027]" : "bg-gray-300"}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === "payment" ? "bg-[#0A4027] text-white" : "bg-gray-300 text-gray-600"}`}>
              2
            </div>
            <div className={`flex-1 h-1 bg-gray-300`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold bg-gray-300 text-gray-600`}>
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#0A4027] mb-6">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0A4027] mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A4027] text-white font-bold py-3 rounded-lg hover:bg-[#0A4027]/90 transition"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#0A4027] mb-6">Payment Information</h2>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0A4027] mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0A4027] mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A4027] mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027]"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="flex-1 border-2 border-[#0A4027] text-[#0A4027] font-bold py-3 rounded-lg hover:bg-[#0A4027]/5 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#0A4027] text-white font-bold py-3 rounded-lg hover:bg-[#0A4027]/90 transition disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
              <h3 className="text-xl font-bold text-[#0A4027] mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b-2 border-[#0A4027]/10">
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-semibold text-[#0A4027]">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#0A4027]">
                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#0A4027] pt-3 border-t-2 border-[#0A4027]/10">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal > 500 && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  ✅ Free shipping on orders over ₹500!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
