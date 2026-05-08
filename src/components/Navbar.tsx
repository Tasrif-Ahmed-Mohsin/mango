"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items } = useCart();
  const pathname = usePathname();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/35 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30 border-b border-white/40 shadow-[0_10px_30px_rgba(10,64,39,0.12)] py-3"
          : "bg-[#FAD65F] py-5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-50">
            <img src="/logo.webp" alt="Logo" className="h-10 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center font-bold text-[15px] text-[#0A4027]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-2 py-1 transition-colors hover:text-[#0A4027]/70 ${
                  pathname === link.path ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0A4027]" : "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0A4027] hover:after:w-full after:transition-all after:duration-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons & Mobile Toggle */}
          <div className="flex gap-5 items-center text-[#0A4027]">
            {/* Search Icon */}
            <button className="hidden md:block hover:opacity-70 transition-opacity p-2 rounded-full hover:bg-white/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>

            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:opacity-70 transition-opacity p-2 rounded-full hover:bg-white/20 flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FAD65F] shadow-sm transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </>
                ) : (
                  <>
                    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className={`flex flex-col gap-4 font-bold text-[15px] text-[#0A4027] rounded-xl p-4 border ${
            isScrolled
              ? "bg-white/45 backdrop-blur-xl border-white/45 shadow-[0_12px_30px_rgba(10,64,39,0.12)]"
              : "bg-[#FAD65F]/95 backdrop-blur-sm border-[#0A4027]/10 shadow-inner"
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-lg transition-colors ${pathname === link.path ? "bg-[#0A4027]/10" : "hover:bg-[#0A4027]/5"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}