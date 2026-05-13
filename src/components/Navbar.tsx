"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items } = useCart();
  const pathname = usePathname();
  const { data: session } = useSession();

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
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] py-2 md:py-3"
          : "bg-[#FAD65F] py-3 md:py-5"
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-50">
            <img src="/logo.webp" alt="Logo" className="h-9 md:h-10 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8 items-center font-semibold text-lg tracking-[0.05em] text-[#0A4027]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-2 py-1 transition-colors hover:text-[#0A4027]/70 ${pathname === link.path ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0A4027]" : "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0A4027] hover:after:w-full after:transition-all after:duration-300"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons & Mobile Toggle */}
          <div className="flex gap-2 sm:gap-4 md:gap-5 items-center text-[#0A4027]">
            {/* Removed Search Icon */}

            {/* Auth Button */}
            {session ? (
              <div className="relative group touch-target flex items-center">
                <button aria-label="User Profile" className="hidden lg:flex hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-[#0A4027]/10 items-center gap-2">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border-2 border-[#0A4027]/20 shadow-sm object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0A4027] text-[#FAD65F] flex items-center justify-center font-bold text-xs shadow-sm">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>
                {/* Dropdown for sign out */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-100 bg-[#FBF7F0]">
                    <p className="text-sm font-bold text-[#0A4027] truncate">{session.user?.name}</p>
                    <p className="text-[11px] font-medium text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="w-full text-left px-4 py-2.5 text-sm text-[#0A4027] hover:bg-[#FAD65F]/20 font-semibold transition-colors flex items-center gap-2 border-b border-gray-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    My Account
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                aria-label="Sign In with Google"
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#EAE3D5] hover:bg-[#FDFCF8] hover:border-[#0A4027]/20 hover:shadow-md transition-all duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
            )}

            {/* Cart Icon */}
            <Link href="/cart" aria-label="Cart" className="relative hover:opacity-70 transition-opacity p-3 md:p-2 rounded-full hover:bg-white/20 flex items-center touch-target">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FAD65F] shadow-sm transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              className="hidden max-lg:flex items-center justify-center w-11 h-11 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[22rem] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className={`flex flex-col gap-2 font-semibold text-lg tracking-[0.05em] text-[#0A4027] rounded-xl p-3 border ${isScrolled
            ? "bg-[#FAD65F]/95 backdrop-blur-xl border-[#E7B93A]/35 shadow-[0_12px_30px_rgba(120,88,0,0.12)]"
            : "bg-[#FAD65F]/95 backdrop-blur-sm border-[#0A4027]/10 shadow-inner"
            }`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-lg transition-colors touch-target ${pathname === link.path ? "bg-[#0A4027]/10" : "hover:bg-[#0A4027]/5"}`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-[#0A4027]/10 my-1 mx-2"></div>

            {/* Mobile Auth Button */}
            {session ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-lg transition-colors touch-target hover:bg-[#0A4027]/10 text-left text-[#0A4027] flex items-center gap-3 w-full font-bold"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  My Account
                </Link>
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="p-3 rounded-lg transition-colors touch-target hover:bg-red-50 text-left text-red-600 flex items-center gap-3 w-full"
                >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out ({session.user?.name})
              </button>
              </>
            ) : (
              <button
                onClick={() => { signIn("google"); setIsMobileMenuOpen(false); }}
                className="p-4 mt-2 rounded-xl transition-all touch-target bg-white text-[#0A4027] border border-[#EAE3D5] active:bg-gray-50 flex items-center justify-center gap-3 w-full shadow-sm font-bold"
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}