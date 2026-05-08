"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@agricommerce.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // Redirect to admin panel
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A4027] to-[#0d5a37] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0A4027] mb-2">Admin Login</h1>
          <p className="text-gray-600">AgriCommerce Management Panel</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>Demo Credentials:</strong>
          <p>Email: admin@agricommerce.com</p>
          <p>Password: admin123</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#0A4027] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027] transition-colors"
              placeholder="admin@agricommerce.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-[#0A4027] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#0A4027]/20 rounded-lg focus:outline-none focus:border-[#0A4027] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A4027] hover:bg-[#0A4027]/90 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[#0A4027] hover:underline font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
