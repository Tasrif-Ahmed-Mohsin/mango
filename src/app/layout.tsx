import type { Metadata } from "next";
import { Poppins, Fraunces, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { DataProvider } from "../context/DataContext";
import Navbar from "../components/Navbar";
import RevealObserver from "../components/RevealObserver";

const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"], 
  variable: '--font-sans' 
});

const fraunces = Fraunces({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: '--font-serif',
});

const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "AgriCommerce - Organic Premium",
  description: "Fresh agricultural products directly from farmers to you.",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAD65F' },
    { media: '(prefers-color-scheme: dark)', color: '#FAD65F' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${fraunces.variable} ${bebas.variable} antialiased bg-[#FBF7F0] text-[#0A4027] tracking-tight`}>
        <DataProvider>
          <CartProvider>
            {/* Main Header */}
            <Navbar />

            <main className="min-h-screen bg-[#FBF7F0]">
              {children}
            </main>

            {/* Wavy Divider above Footer */}
            <div className="w-full overflow-hidden leading-[0] bg-[#FBF7F0]">
              <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px]">
                <path d="M0 0V60C180 30 360 100 540 60C720 20 900 0 1080 50C1260 100 1380 80 1440 40V100H0V0Z" fill="#FBF7F0"/>
              </svg>
            </div>

            <RevealObserver>
            <footer className="relative bg-[#FBF7F0] text-[#0A4027] pt-20 pb-8 border-t border-[#EAE5D9] overflow-hidden">
              <img src="/icons8-mango (2).svg" alt="" className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] pointer-events-none -rotate-12" />
              <img src="/scandi-stylized-green-leaves-nature-themed-decoration.svg" alt="" className="absolute top-0 right-1/3 w-48 h-48 opacity-[0.03] pointer-events-none rotate-45" />
              <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-left">
                  {/* Brand & About */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-1 border-r-0 lg:border-r border-[#EAE5D9] pr-0 lg:pr-8 reveal anim-fade-up delay-0">
                    <h3 className="text-5xl mb-4 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      <span className="text-[#0A4027]">Fresh</span> <span className="text-[#F0A500]">Mango.</span>
                    </h3>
                    <p className="text-[#3A5333] mb-6 font-medium leading-relaxed">
                      Bringing the finest, sun-kissed organic mangoes directly from our farms to your doorstep. Taste the natural sweetness of authentic sourcing.
                    </p>
                    <div className="flex gap-4">
                      <button className="w-10 h-10 rounded-full bg-[#EBF5E3] flex items-center justify-center text-[#0A4027] hover:bg-[#FCD860] hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#EBF5E3] flex items-center justify-center text-[#0A4027] hover:bg-[#FCD860] hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#EBF5E3] flex items-center justify-center text-[#0A4027] hover:bg-[#FCD860] hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                      </button>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="reveal anim-fade-up delay-100">
                    <h4 className="text-3xl mb-5 text-[#0A4027] tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Quick Links</h4>
                    <ul className="flex flex-col gap-3 font-medium text-[#3A5333]">
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">Our Shop</a></li>
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">The Mango Promise</a></li>
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">About Us</a></li>
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">Blog & Recipes</a></li>
                    </ul>
                  </div>

                  {/* Customer Care */}
                  <div className="reveal anim-fade-up delay-200">
                    <h4 className="text-3xl mb-5 text-[#0A4027] tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Customer Care</h4>
                    <ul className="flex flex-col gap-3 font-medium text-[#3A5333]">
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">Track Order</a></li>
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">Shipping & Delivery</a></li>
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">Returns & Refunds</a></li>
                      <li><a href="#" className="hover:text-[#F0A500] hover:translate-x-1 inline-block transition-transform duration-300">FAQs</a></li>
                    </ul>
                  </div>

                  {/* Contact Us */}
                  <div className="reveal anim-fade-up delay-300">
                    <h4 className="text-3xl mb-5 text-[#0A4027] tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Contact Us</h4>
                    <ul className="flex flex-col gap-4 font-medium text-[#3A5333]">
                      <li className="flex items-start gap-3">
                        <span className="text-xl leading-none">📍</span>
                        <span className="leading-tight">123 Orchard Valley Rd<br/>Rajshahi, Bangladesh</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-xl leading-none">📞</span>
                        <a href="tel:+8801234567890" className="hover:text-[#F0A500] transition-colors">+880 1234 567890</a>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-xl leading-none">✉️</span>
                        <a href="mailto:hello@freshmango.com" className="hover:text-[#F0A500] transition-colors">hello@freshmango.com</a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#EAE5D9]/80 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left reveal anim-fade-in delay-500">
                  <p className="text-sm font-semibold text-[#3A5333]">&copy; 2026 Fresh Mango. All rights reserved.</p>
                  <div className="flex gap-6 text-sm font-bold text-[#3A5333]">
                    <a href="#" className="hover:text-[#0A4027] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#0A4027] transition-colors">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
            </RevealObserver>
          </CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}