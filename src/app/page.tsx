"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useData } from "../context/DataContext";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { addToCart } = useCart();
  const { categories, products } = useData();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [slideIndex, setSlideIndex] = useState(0);

  const heroSlides = [
    {
      label: "Origin",
      textStart: "Handpicked from our organic orchards at peak ripeness,",
      textHighlight: "cold-pressed to keep every mango naturally vibrant.",
    },
    {
      label: "Purity",
      textStart: "Pure mango with no additives, no concentrates,",
      textHighlight: "just honest fruit flavor in every refreshing pour.",
    },
    {
      label: "Delivery",
      textStart: "Farm-fresh bottles made in small batches and delivered fast,",
      textHighlight: "so each glass arrives bright, smooth, and sweet.",
    },
    {
      label: "Experience",
      textStart: "From first aroma to final sip, enjoy a sun-kissed mango journey",
      textHighlight: "that brings summer energy into every single glass.",
    },
  ];

  useEffect(() => { setMounted(true); }, []);

  // Hero text slideshow
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Unified parallax: deterministic lerp scroll + multi-directional slow 2D float
  useEffect(() => {
    if (!mounted) return;
    let raf: number;
    const start = performance.now();

    // ── Cache element refs + parsed props once (no DOM query per frame) ──
    type Slot = { el: HTMLElement; amp: number; phase: number; baseR: number; py: number };
    const slots: Slot[] = [];
    document.querySelectorAll<HTMLElement>('[data-parallax-amp]').forEach(el => {
      slots.push({
        el,
        amp: parseFloat(el.dataset.parallaxAmp ?? '16'),
        phase: parseFloat(el.dataset.parallaxPhase ?? '0'),
        baseR: parseFloat(el.dataset.parallaxR ?? '0'),
        py: 0,
      });
    });
    if (slots.length === 0) return;

    const tick = (now: number) => {
      const y = window.scrollY;
      const t = (now - start) * 0.001; // seconds

      for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        
        // Deterministic scroll target (moves opposite to scroll direction for parallax effect)
        const targetScrollY = y * s.amp * -0.015;
        // Smooth lerp towards target to completely eliminate jitter
        s.py += (targetScrollY - s.py) * 0.08;

        // Multi-directional slow float
        const floatY = Math.sin(t * 0.4 + s.phase) * 12;
        const floatX = Math.cos(t * 0.3 + s.phase * 1.5) * 15;
        const floatR = Math.sin(t * 0.2 + s.phase) * 4;
        
        // Rotation sway based gently on scroll distance
        const swayR = s.py * -0.08;

        // Single GPU-composited transform string
        s.el.style.transform =
          `translate3d(${floatX.toFixed(1)}px, ${(s.py + floatY).toFixed(1)}px, 0) rotate(${(s.baseR + floatR + swayR).toFixed(2)}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  // Scroll-reveal: observe all .reveal elements and add .visible on entry
  useEffect(() => {
    if (!mounted) return;
    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 60);
    return () => { clearTimeout(timer); observer?.disconnect(); };
  }, [mounted, categories, products, activeCategory]);

  if (!mounted) return null;

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <div className="pb-16 relative w-full overflow-hidden bg-[#FBF7F0]">
      {/* Global Background Nature SVGs (Watermarks) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden isolate">

        {/* Top-Right: Scandinavian leaf cluster */}
        <div className="absolute top-[3%] right-[-1%] w-[460px] h-[460px] opacity-[0.06] -rotate-6">
          <img src="/scandi-stylized-green-leaves-nature-themed-decoration.svg" alt="" loading="lazy" decoding="async" className="w-full h-full object-contain" />
        </div>

        {/* Top-Left: Whole mango */}
        <div className="absolute top-[10%] left-[3%] w-[130px] h-[130px] opacity-[0.06] -rotate-[25deg]">
          <img src="/icons8-mango (2).svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Mid-Left: Wind/air */}
        <div className="absolute top-[28%] left-[1%] w-[190px] h-[190px] opacity-[0.06] rotate-12">
          <img src="/icons8-wind.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Mid-Right: Windstorm */}
        <div className="absolute top-[25%] right-[2%] w-[180px] h-[180px] opacity-[0.05] -rotate-[18deg]">
          <img src="/icons8-windstorm.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Center-Left: Whole mango */}
        <div className="absolute top-[42%] left-[5%] w-[170px] h-[170px] opacity-[0.06] rotate-[22deg]">
          <img src="/icons8-mango (2).svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Center-Right: Half mango (brand hero) */}
        <div className="absolute top-[45%] right-[4%] w-[180px] h-[180px] opacity-[0.06] -rotate-[12deg]">
          <img src="/icons8-mango (1).svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Mid-Bottom: Windstorm echo */}
        <div className="absolute top-[58%] right-[3%] w-[200px] h-[200px] opacity-[0.05] rotate-[8deg]">
          <img src="/icons8-windstorm.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Bottom-Left: Large half mango */}
        <div className="absolute top-[74%] left-[3%] w-[240px] h-[240px] opacity-[0.06] -rotate-[8deg]">
          <img src="/icons8-mango (1).svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Bottom-Right: Leaf cluster */}
        <div className="absolute top-[80%] right-[3%] w-[180px] h-[180px] opacity-[0.05] rotate-[30deg]">
          <img src="/icons8-leaf.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Bottom-Center: Scandinavian echo */}
        <div className="absolute top-[90%] right-[-3%] w-[300px] h-[300px] opacity-[0.04] rotate-[12deg]">
          <img src="/scandi-stylized-green-leaves-nature-themed-decoration.svg" alt="" className="w-full h-full object-contain" />
        </div>

      </div>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden pt-14 pb-24 md:pt-16 md:pb-28 flex flex-col justify-center min-h-[68vh] md:min-h-[85vh] bg-[#FAD65F] isolate"
        onMouseMove={(e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 30;
          const y = (e.clientY / window.innerHeight - 0.5) * 30;
          setMousePos({ x, y });
        }}
      >
        {/* Subtle Noise Texture & Glowing Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgogICAgPC9maWx0ZXI+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2UpIi8+Cjwvc3ZnPg==')]"></div>

        {/* Real Fruit Background Images (Mouse Parallax) */}
        <div 
          className="absolute -bottom-12 -left-12 md:-left-4 md:-bottom-4 w-5/12 sm:w-1/4 md:w-1/5 h-auto opacity-100 z-0 hero-mango-l transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
        >
          <img src="/1.webp" alt="Real Mango 1" loading="lazy" decoding="async" className="w-full h-full object-contain filter drop-shadow-2xl transform rotate-12" />
        </div>
        <div 
          className="absolute -bottom-12 -right-12 md:-right-4 md:-bottom-4 w-1/2 sm:w-1/3 md:w-1/4 h-auto opacity-100 z-0 hero-mango-r transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(${-mousePos.x}px, ${-mousePos.y}px, 0)` }}
        >
          <img src="/2.webp" alt="Real Mango 2" loading="lazy" decoding="async" className="w-full h-full object-contain filter drop-shadow-2xl transform -rotate-12" />
        </div>

        {/* Frosted Glass Overlay fading from bottom to top */}
        <div
          className="absolute inset-0 z-0 backdrop-blur-lg pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%)'
          }}
        ></div>

        {/* Main Logo & CTA Container */}
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <div className="flex justify-center items-center hero-logo">
            {/* Clip whitespace: container crops top/bottom padding from the image */}
            <div className="w-[78%] sm:w-[62%] md:w-[50%] lg:w-[44%] max-w-[560px] overflow-hidden" style={{ maxHeight: '190px' }}>
              <img
                src="/logo.webp"
                alt="Fresh Mango Juice Just Fruit"
                className="w-full object-cover object-center filter drop-shadow-[0_10px_20px_rgba(10,64,39,0.2)] transition-transform hover:scale-105 duration-700"
                style={{ marginTop: '-10%', marginBottom: '-10%' }}
              />
            </div>
          </div>
          
          <div className="mt-8 md:mt-10 mx-auto flex max-w-2xl flex-col items-center gap-5 md:gap-6 reveal anim-fade-up delay-200">

            {/* Animated Text Slideshow */}
            <div className="relative h-24 md:h-28 w-full max-w-xl overflow-hidden px-3">
              {heroSlides.map((slide, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
                  style={{
                    opacity: i === slideIndex ? 1 : 0,
                    transform: i === slideIndex
                      ? 'translateY(0px)'
                      : i === (slideIndex - 1 + 4) % 4
                        ? 'translateY(-18px)'
                        : 'translateY(18px)',
                  }}
                >
                  <span className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#0A4027]/50 font-semibold mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {slide.label}
                  </span>
                  <span className="text-lg sm:text-xl md:text-[1.5rem] font-semibold tracking-[0.06em] leading-snug text-center max-w-[42rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    <span className="text-[#11311F]">{slide.textStart} </span>
                    <span className="text-[#F0A500]">{slide.textHighlight}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Slide dots */}
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === slideIndex
                      ? 'w-4 h-1.5 bg-[#0A4027]'
                      : 'w-1.5 h-1.5 bg-[#0A4027]/30'
                  }`}
                />
              ))}
            </div>

            {/* CTA */}
            <a
              href="#shop"
              onClick={(e) => { e.preventDefault(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group mt-1 inline-flex items-center gap-2 bg-white/80 hover:bg-white text-[#0A4027] font-bold text-[11px] md:text-xs uppercase tracking-[0.2em] px-6 py-2.5 rounded-full border border-[#0A4027]/10 hover:border-[#0A4027]/30 shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] backdrop-blur-md transition-all duration-300"
            >
              Shop Now
              <span className="group-hover:translate-x-1 transition-transform text-[#F0A500]">→</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          onClick={(e) => { e.preventDefault(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <span className="text-[#0A4027] text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 text-[#0A4027]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>

        {/* Decorative Nature Elements — GPU-accelerated by rAF loop above */}
        {/* — Aamchoto (Small Mangoes) — */}
        <div data-parallax-amp="18" data-parallax-phase="0" data-parallax-r="-15" className="absolute top-[18%] left-[8%] w-12 md:w-20 z-10 pointer-events-none">
          <img src="/aamchoto.svg" alt="" className="w-full h-auto drop-shadow-md opacity-75 reveal anim-fade-up" style={{ animationDelay: '200ms' }} />
        </div>
        <div data-parallax-amp="13" data-parallax-phase="1.1" data-parallax-r="18" className="absolute top-[32%] right-[10%] w-10 md:w-16 z-10 pointer-events-none">
          <img src="/aamchoto.svg" alt="" className="w-full h-auto drop-shadow-md opacity-65 reveal anim-fade-up" style={{ animationDelay: '400ms' }} />
        </div>
        <div data-parallax-amp="22" data-parallax-phase="2.2" data-parallax-r="-25" className="absolute top-[54%] left-[10%] w-14 md:w-20 z-10 pointer-events-none">
          <img src="/aamchoto.svg" alt="" className="w-full h-auto drop-shadow-md opacity-70 reveal anim-fade-up" style={{ animationDelay: '600ms' }} />
        </div>

        {/* — Pata1 (Leaf Style 1) — */}
        <div data-parallax-amp="16" data-parallax-phase="0.6" data-parallax-r="-5" className="absolute bottom-[18%] left-[18%] w-12 md:w-20 z-10 pointer-events-none">
          <img src="/pata1.svg" alt="" className="w-full h-auto drop-shadow-md opacity-65 reveal anim-fade-up" style={{ animationDelay: '300ms' }} />
        </div>
        <div data-parallax-amp="11" data-parallax-phase="1.7" data-parallax-r="-20" className="absolute top-[38%] right-[28%] w-9 md:w-15 z-10 pointer-events-none">
          <img src="/pata1.svg" alt="" className="w-full h-auto drop-shadow-md opacity-55 reveal anim-fade-up" style={{ animationDelay: '500ms' }} />
        </div>
        <div data-parallax-amp="20" data-parallax-phase="2.8" data-parallax-r="-8" className="absolute bottom-[22%] right-[22%] w-11 md:w-18 z-10 pointer-events-none">
          <img src="/pata1.svg" alt="" className="w-full h-auto drop-shadow-md opacity-60 reveal anim-fade-up" style={{ animationDelay: '700ms' }} />
        </div>

        {/* — Pata2 (Leaf Style 2) — */}
        <div data-parallax-amp="24" data-parallax-phase="0.3" data-parallax-r="25" className="absolute bottom-[10%] right-[14%] w-14 md:w-22 z-10 pointer-events-none">
          <img src="/pata2.svg" alt="" className="w-full h-auto drop-shadow-md opacity-70 reveal anim-fade-up" style={{ animationDelay: '400ms' }} />
        </div>
        <div data-parallax-amp="14" data-parallax-phase="1.4" data-parallax-r="-15" className="absolute bottom-[28%] left-[28%] w-10 md:w-16 z-10 pointer-events-none">
          <img src="/pata2.svg" alt="" className="w-full h-auto drop-shadow-md opacity-55 reveal anim-fade-up" style={{ animationDelay: '600ms' }} />
        </div>
        <div data-parallax-amp="19" data-parallax-phase="2.5" data-parallax-r="35" className="absolute top-[48%] right-[10%] w-9 md:w-14 z-10 pointer-events-none">
          <img src="/pata2.svg" alt="" className="w-full h-auto drop-shadow-md opacity-50 reveal anim-fade-up" style={{ animationDelay: '800ms' }} />
        </div>

        {/* Wavy Bottom Edge */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px] md:h-[100px]">
            <path d="M0 120V60C180 10 360 0 540 20C720 40 900 120 1080 80C1260 40 1380 15 1440 0V120H0Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="w-full bg-white relative z-10 py-12 mb-0">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-0 mb-8 border-b border-gray-100 pb-4 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <h2 className="text-5xl md:text-6xl font-bold text-[#0A4027] drop-shadow-sm tracking-wide reveal anim-fade-up delay-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <span className="text-[#0A4027]">Our</span>{" "}<span className="text-[#F0A500]">Categories</span>
              </h2>
              <svg className="w-48 md:w-64 h-6 mb-4 reveal anim-fade-in delay-100 visible" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16C20 4 40 -2 60 12C80 26 100 18 120 6C140 -6 160 4 180 16C190 22 196 14 196 14" stroke="#F0A500" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="text-[#8B9B91] font-semibold text-sm hidden sm:block mb-2 reveal anim-fade-in delay-200">Explore our freshly picked nature drops</span>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-5 justify-center sm:justify-start">
            {/* "All" Category Button */}
            <button
              onClick={() => setActiveCategory("all")}
              style={{ animationDelay: '80ms' }}
              className={`group w-[120px] sm:w-[150px] md:w-[160px] rounded-[2.5rem] p-4 sm:p-5 flex flex-col items-center justify-start transition-all duration-300 shadow-2xl bg-white hover:-translate-y-1 reveal anim-scale-up border-[6px] ${activeCategory === "all" ? 'border-[#F0A500]' : 'border-[#E3E8CD] hover:border-[#FCD860]'}`}
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center text-4xl sm:text-5xl mb-3 sm:mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 bg-[#F8FBF5] text-[#8B9B91] group-hover:text-[#0A4027]`}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-10 sm:h-10"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
              </div>
              <span className={`text-sm sm:text-base md:text-lg font-bold text-center transition-colors duration-300 ${activeCategory === "all" ? 'text-[#0A4027]' : 'text-gray-500 group-hover:text-[#0A4027]'}`}>
                All
              </span>
            </button>

            {/* Dynamic Categories */}
            {categories.map((c: any, ci: number) => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  style={{ animationDelay: `${(ci + 2) * 80}ms` }}
                  className={`group w-[120px] sm:w-[150px] md:w-[160px] rounded-[2.5rem] p-4 sm:p-5 flex flex-col items-center justify-start transition-all duration-300 shadow-2xl bg-white hover:-translate-y-1 reveal anim-scale-up border-[6px] ${isActive ? 'border-[#F0A500]' : 'border-[#E3E8CD] hover:border-[#FCD860]'}`}
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center text-4xl sm:text-5xl mb-3 sm:mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden ${c.image ? 'bg-transparent shadow-sm' : c.bgColor || 'bg-[#FDF2B3]'}`}>
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      c.icon || "📦"
                    )}
                  </div>
                  <span className={`text-sm sm:text-base md:text-lg font-bold text-center transition-colors duration-300 leading-tight ${isActive ? 'text-[#0A4027]' : 'text-gray-500 group-hover:text-[#0A4027]'}`}>
                    {c.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wavy Divider: White → Sage */}
      <div className="w-full overflow-hidden leading-[0] relative z-10 bg-white">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px] block">
          <path d="M0 0C180 60 360 100 540 70C720 40 900 0 1080 50C1260 100 1380 80 1440 30V100H0V0Z" fill="#E3E8CD" />
        </svg>
      </div>

      {/* Top Product Section */}
      <section id="shop" className="bg-[#E3E8CD] py-16 pb-12 -mt-1">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-0 mb-10 border-b border-[#C4CCAF] pb-4 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <h2 className="text-5xl md:text-6xl font-bold text-[#11311F] drop-shadow-sm tracking-wide reveal anim-fade-up delay-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <span className="text-[#11311F]">Fresh</span>{" "}<span className="text-[#F0A500]">Picks</span>
              </h2>
              <svg className="w-48 md:w-64 h-6 mb-4 reveal anim-fade-in delay-100 visible" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16C20 4 40 -2 60 12C80 26 100 18 120 6C140 -6 160 4 180 16C190 22 196 14 196 14" stroke="#F0A500" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <button
              onClick={() => setActiveCategory("all")}
              className="text-sm font-semibold text-[#4A6840] hover:text-[#11311F] transition flex items-center gap-2 group"
            >
              Browse All <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((p: any, pi: number) => (
              <div key={p.id} style={{ animationDelay: `${pi * 80}ms` }} className="group relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden transition-all duration-500 bg-white hover:bg-gradient-to-b hover:from-[#F0A500] hover:to-[#D26900] shadow-2xl hover:shadow-[0_8px_30px_rgba(210,105,0,0.3)] flex flex-col border-[4px] sm:border-[6px] border-[#E3E8CD] hover:border-[#F0A500] reveal anim-fade-up">
                <Link href={`/product/${p.id}`} className="block flex-grow flex flex-col">
                  {/* Image Area */}
                  <div className="relative overflow-hidden mb-2 sm:mb-4 aspect-[4/3] bg-gray-50 group-hover:bg-white/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1.5 rounded-full z-10">
                      {p.tag || "20% off"}
                    </div>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-500">{p.emoji || "📦"}</span>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-3 sm:px-5 pb-4 sm:pb-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-sm sm:text-xl text-gray-900 group-hover:text-white transition-colors duration-300 leading-tight line-clamp-1 tracking-tight">{p.name}</h3>
                      <div className="bg-gray-900 group-hover:bg-black/30 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors duration-300 shrink-0">
                        ${p.price.toFixed(2)}
                      </div>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-gray-500 group-hover:text-white/90 transition-colors duration-300 line-clamp-2 mb-3 sm:mb-4 leading-relaxed font-medium">
                      {p.description || `Loved worldwide for their freshness, our ${p.name} are a delicious delight wherever you are.`}
                    </p>

                    <div className="hidden sm:flex gap-2 mb-5 mt-auto">
                      <span className="bg-gray-100 group-hover:bg-white/20 text-gray-700 group-hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors duration-300">
                        Best Seller
                      </span>
                      <span className="bg-gray-100 group-hover:bg-white/20 text-gray-700 group-hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors duration-300">
                        {p.stock || 9} left
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.preventDefault(); addToCart(p.id, 1); }}
                      className="w-full py-2.5 sm:py-3.5 rounded-full bg-[#FCD860] group-hover:bg-white text-[#0A4027] group-hover:text-[#A85800] font-bold text-[11px] sm:text-[13px] transition-all duration-300 shadow-sm group-hover:shadow-md"
                    >
                      Add to cart
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wavy Divider: Sage → Cream */}
      <div className="w-full overflow-hidden leading-[0] bg-[#E3E8CD] -mt-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px]">
          <path d="M0 100C180 50 360 0 540 40C720 80 900 100 1080 60C1260 20 1380 10 1440 50V100H0Z" fill="#FBF7F0" />
        </svg>
      </div>

      {/* Core Values Section */}
      <section className="container mx-auto px-6 mt-16 relative z-10">
        <div className="text-center mb-10 border-b border-[#C4CCAF] pb-8">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#0A4027] mb-4 tracking-wide reveal anim-fade-up delay-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="text-[#0A4027]">The</span>{" "}<span className="text-[#1A6B3C]">Mango</span>{" "}<span className="text-[#F0A500]">Promise</span>
          </h2>
        </div>
      </section>

      {/* Scrolling Marquee Banner – full width */}
      <div className="relative z-10 overflow-hidden bg-gradient-to-r from-[#FCE282] via-[#FDF2B3] to-[#FCE282] py-3 mb-12 shadow-lg">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Duplicate the items array directly for seamless infinite loop */}
          {[0, 1, 2, 3].map((_, dup) =>
            [
              { icon: "/icons8-mango (1).svg", text: "Fresh Picks" },
              { icon: "/icons8-leaf.svg", text: "100% Organic" },
              { icon: "/icons8-delivery.svg", text: "Free Delivery" },
              { icon: "/icons8-trust.svg", text: "Premium Quality" },
            ].map((item, i) => (
              <div key={`${dup}-${i}`} className="flex items-center gap-4 shrink-0 px-7">
                <img src={item.icon} alt="" className="h-6 w-6 md:h-7 md:w-7 object-contain brightness-0 opacity-70" />
                <span className="text-[#11311F] font-extrabold text-base md:text-lg tracking-wide">
                  {item.text}
                </span>
                <span className="text-[#D26900] text-2xl md:text-3xl opacity-80">&bull;</span>
              </div>
            ))
          )}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FCE282] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FCE282] to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Cards – Editorial Newspaper Style */}
      <section className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 reveal anim-fade-up delay-0">

          <div className="flex flex-col bg-white shadow-2xl overflow-hidden rounded-[2.5rem] border-[6px] border-[#E3E8CD] hover:border-[#FCD860] transition-colors duration-300 spring-hover cursor-pointer group">
            <div className="relative h-44 md:h-52 overflow-hidden">
              <img src="/sourcing.webp" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
              <img src="/icons8-mango (1).svg" alt="" className="absolute bottom-3 left-4 w-12 h-12 object-contain drop-shadow-lg" style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }} />
            </div>
            <div className="p-6 md:p-8 flex-1">
              <div className="w-8 h-0.5 bg-[#FCD860] mb-3"></div>
              <h3 className="text-3xl font-bold text-[#0A4027] mb-2 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Authentic <span className="text-[#F0A500]">Sourcing</span></h3>
              <p className="text-[#5A7D4C] text-sm leading-relaxed mb-4">Handpicked directly from our organic, sun-kissed gardens. Nature&apos;s sweet essence preserved for you.</p>
              <div className="flex items-center gap-2 mt-auto">
                <img src="/icons8-mango.svg" alt="" className="w-4 h-4 opacity-40" />
                <span className="text-xs font-semibold text-[#0A4027]/40 uppercase tracking-widest">Farm Fresh</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white shadow-2xl overflow-hidden rounded-[2.5rem] border-[6px] border-[#E3E8CD] hover:border-[#FCD860] transition-colors duration-300 spring-hover cursor-pointer group">
            <div className="relative h-44 md:h-52 overflow-hidden">
              <img src="/delivery.webp" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
              <img src="/icons8-delivery.svg" alt="" className="absolute bottom-3 left-4 w-12 h-12 object-contain drop-shadow-lg" style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }} />
            </div>
            <div className="p-6 md:p-8 flex-1">
              <div className="w-8 h-0.5 bg-[#FCD860] mb-3"></div>
              <h3 className="text-3xl font-bold text-[#0A4027] mb-2 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Proper <span className="text-[#F0A500]">Delivery</span></h3>
              <p className="text-[#5A7D4C] text-sm leading-relaxed mb-4">Climate-controlled shipping — your fruits arrive perfectly intact and juicy every time.</p>
              <div className="flex items-center gap-2 mt-auto">
                <img src="/icons8-delivery.svg" alt="" className="w-4 h-4 opacity-40" />
                <span className="text-xs font-semibold text-[#0A4027]/40 uppercase tracking-widest">Swift & Safe</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white shadow-2xl overflow-hidden rounded-[2.5rem] border-[6px] border-[#E3E8CD] hover:border-[#FCD860] transition-colors duration-300 spring-hover cursor-pointer group">
            <div className="relative h-44 md:h-52 overflow-hidden">
              <img src="/commitment.webp" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
              <img src="/icons8-trust.svg" alt="" className="absolute bottom-3 left-4 w-12 h-12 object-contain drop-shadow-lg" style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }} />
            </div>
            <div className="p-6 md:p-8 flex-1">
              <div className="w-8 h-0.5 bg-[#FCD860] mb-3"></div>
              <h3 className="text-3xl font-bold text-[#0A4027] mb-2 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Our <span className="text-[#F0A500]">Commitment</span></h3>
              <p className="text-[#5A7D4C] text-sm leading-relaxed mb-4">Uncompromising quality — every single bite of our produce is guaranteed to satisfy.</p>
              <div className="flex items-center gap-2 mt-auto">
                <img src="/icons8-trust.svg" alt="" className="w-4 h-4 opacity-40" />
                <span className="text-xs font-semibold text-[#0A4027]/40 uppercase tracking-widest">100% Trust</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Wavy Divider: Cream → Soft Clay */}
      <div className="w-full overflow-hidden leading-[0] relative z-10 mt-20">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px] block">
          <path d="M0 0C180 60 360 100 540 70C720 40 900 0 1080 50C1260 100 1380 80 1440 30V100H0V0Z" fill="#ECF0E8" />
        </svg>
      </div>

      {/* Social Media Connections Section */}
      <section className="bg-[#ECF0E8] relative z-10 -mt-1 pt-12 pb-16 overflow-hidden">
        {/* Background SVG Decorations */}
        <img src="/scandi-stylized-green-leaves-nature-themed-decoration.svg" alt="" className="absolute -top-5 -left-5 w-32 md:w-40 opacity-[0.06] pointer-events-none animate-float" />
        <img src="/icons8-leaf.svg" alt="" className="absolute top-10 right-0 w-20 md:w-28 opacity-[0.06] pointer-events-none rotate-12 animate-float-delayed" />
        <img src="/icons8-wind.svg" alt="" className="absolute bottom-16 left-1/4 w-20 md:w-24 opacity-[0.05] pointer-events-none" />
        <img src="/icons8-mango (1).svg" alt="" className="absolute top-32 left-8 w-16 md:w-20 opacity-[0.05] pointer-events-none -rotate-12" />
        <img src="/pata1.svg" alt="" className="absolute bottom-20 right-10 w-16 md:w-20 opacity-[0.05] pointer-events-none rotate-45" />
        <img src="/pata2.svg" alt="" className="absolute top-1/2 left-0 w-14 md:w-16 opacity-[0.04] pointer-events-none -rotate-6" />
        <img src="/icons8-leaf.svg" alt="" className="absolute bottom-8 right-1/3 w-14 md:w-18 opacity-[0.05] pointer-events-none -rotate-20" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center relative py-10">

            <h2 className="text-4xl md:text-6xl font-bold mb-2 tracking-wide relative z-10 reveal anim-fade-up delay-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-[#1A3C2A]">Let&apos;s</span>{" "}<span className="text-[#F0A500]">Stay Connected</span>
            </h2>
            {/* Hook / Swash underline */}
            <svg className="w-48 md:w-64 h-6 mb-4 reveal anim-fade-in delay-100" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16C20 4 40 -2 60 12C80 26 100 18 120 6C140 -6 160 4 180 16C190 22 196 14 196 14" stroke="#F0A500" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            <p className="text-[#4A6B4D] text-sm md:text-base font-medium max-w-xl mx-auto mb-12 relative z-10 reveal anim-fade-in delay-200">
              Join our community for fresh updates, exclusive offers, and behind-the-scenes looks at our organic farms!
            </p>

            {/* Phone Mockup + Social Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10 reveal anim-fade-up delay-300">
              {/* Phone Screen */}
              <div className="relative shrink-0 group cursor-default">
                <div className="w-56 h-96 rounded-[2.5rem] border-[6px] border-[#E8E4DB] bg-[#F5F3ED] shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1 group-hover:shadow-[0_25px_60px_-10px_rgba(10,64,39,0.15)] group-hover:border-[#D4CFC3]">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#0A4027]/15 rounded-full z-10"></div>
                  <img src="/phone-mockup.webp" alt="Social media preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>

              {/* Heart React Button */}
              <div className="flex flex-col items-center gap-6">
                <p className="text-sm font-semibold text-[#1A3C2A]/60 uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>React</p>
                <button className="heart-react-btn shadow-2xl transition-shadow duration-500 hover:shadow-[0_25px_60px_-10px_rgba(10,64,39,0.15)]">
                  <svg className="heart-empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0H24V24H0z"></path>
                    <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path>
                  </svg>
                  <svg className="heart-filled" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H24V24H0z" fill="none"></path>
                    <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>
                  </svg>
                  Like
                </button>
              </div>

              {/* Social Buttons Pill */}
              <div className="flex flex-col items-center gap-6">
                <p className="text-sm font-semibold text-[#1A3C2A]/60 uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Follow Us</p>
                <div className="flex items-center gap-3 bg-[#e8e8e8] px-6 py-4 rounded-[28px] shadow-2xl transition-shadow duration-500 hover:shadow-[0_25px_60px_-10px_rgba(10,64,39,0.15)] border-[6px] border-[#E8E4DB]">
                  <a href="#" className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/30 group">
                    <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#DD2A7B]/30 group">
                    <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#25D366]/30 group">
                    <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#F0A500] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#F0A500]/30 group">
                    <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wavy Divider: Soft Clay → Sage Green */}
      <div className="w-full overflow-hidden leading-[0] bg-[#ECF0E8] relative z-10 -mt-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px] block">
          <path d="M0 0C180 60 360 100 540 70C720 40 900 0 1080 50C1260 100 1380 80 1440 30V100H0V0Z" fill="#E3E8CD" />
        </svg>
      </div>

      {/* Message Us Section */}
      <section className="bg-[#E3E8CD] relative z-10 py-16 pb-24">
        <div className="container mx-auto px-6">
          
          <div className="text-center mb-12 reveal anim-fade-up">
            <h2 className="text-5xl md:text-6xl font-bold text-[#11311F] drop-shadow-sm tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Your Words <span className="text-[#F0A500]">Matter</span>
            </h2>
            <p className="text-[#5A7D4C] text-sm md:text-base font-medium max-w-2xl mx-auto mt-3">
              We&apos;re always excited to hear from you. Reach out via WhatsApp or leave a message below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10 reveal anim-fade-up delay-100">

            {/* WhatsApp Connect Card */}
            <div className="w-full bg-white shadow-2xl rounded-[2.5rem] border-[6px] border-[#E8E4DB] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="w-full h-[70px] relative flex items-center px-6 border-b border-[#f1f1f1] shrink-0 bg-gradient-to-r from-white to-[#F5F8F2]">
                <h3 className="text-3xl tracking-wide pt-1 flex items-center gap-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  <span className="text-[#0A4027]">Order via</span> <span className="text-[#25D366]">WhatsApp</span>
                </h3>
                <div className="absolute bottom-[-1px] left-6 w-[120px] h-[3px] bg-[#25D366] rounded-t-full"></div>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col items-center flex-grow bg-white relative justify-center">
                {/* Decorative background logo */}
                <svg className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-[0.03] text-[#25D366] pointer-events-none rotate-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>

                {/* QR Code Container */}
                <div className="w-40 h-40 bg-[#FAFAFA] rounded-3xl p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] border border-[#E8E4DB]/60 mb-6 flex items-center justify-center relative group">
                  <div className="w-full h-full bg-white rounded-xl shadow-sm border border-[#f1f1f1] overflow-hidden relative opacity-90 group-hover:opacity-100 transition-opacity">
                    <img src="/qr-code.png" alt="Scan to chat on WhatsApp" className="w-full h-full object-cover" />
                  </div>
                  {/* Center WhatsApp Logo on QR */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md">
                    <svg className="w-6 h-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                </div>

                <div className="text-center z-10">
                  <p className="text-[#8B9B91] font-semibold text-[10px] uppercase tracking-[0.2em] mb-1.5">Direct Contact</p>
                  <h4 className="text-[#0A4027] text-[22px] font-bold mb-1.5 tracking-tight">+880 1234 567890</h4>
                  <p className="text-[#4A6B4D] text-[13px] font-medium mb-6 leading-relaxed max-w-[200px] mx-auto">Scan with your phone camera or click below to chat.</p>
                  
                  <a href="#" className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* The Message Us Card */}
            <div className="w-full bg-white shadow-2xl rounded-[2.5rem] border-[6px] border-[#E8E4DB] overflow-hidden h-full flex flex-col">

              {/* Title Area */}
              <div className="w-full h-[70px] relative flex items-center px-6 border-b border-[#f1f1f1]">
                <h3 className="text-3xl tracking-wide pt-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  <span className="text-[#0A4027]">Message</span> <span className="text-[#F0A500]">Us</span>
                </h3>
                <div className="absolute bottom-[-1px] left-6 w-[70px] h-[3px] bg-[#F0A500] rounded-t-full"></div>
              </div>

              {/* Comments/Message Thread */}
              <div className="p-6 grid grid-cols-[45px_1fr] gap-4 bg-white">

                {/* Mango Support Avatar */}
                <div className="w-11 h-11 relative flex items-center justify-center bg-[#F8FBF5] border border-[#E3E8CD] rounded-full shrink-0 shadow-sm">
                  <img src="/icons8-mango (1).svg" alt="Mango Support" className="w-7 h-7 object-contain drop-shadow-sm" />
                  <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-[#0fc45a] border-2 border-white"></div>
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-1.5 mt-0.5">
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-[#0A4027]">Mango Support</span>
                    <p className="font-semibold text-[11px] text-[#8B9B91]">Just now</p>
                  </div>
                  <p className="text-[13px] leading-relaxed font-medium text-[#4A6B4D] bg-[#F8FBF5] p-3.5 rounded-2xl rounded-tl-sm border border-[#E3E8CD]/50 mt-1 shadow-sm">
                    We&apos;d love to hear your thoughts or help you place a fresh order! What can we do for you today?
                  </p>
                </div>
              </div>

              {/* Text Box / Input Area */}
              <div className="w-full bg-[#F5F3ED] p-3.5 border-t border-[#E8E4DB]/50">
                <div className="bg-white rounded-[1.5rem] p-2.5 shadow-sm border border-[#E8E4DB]/30 transition-all focus-within:border-[#FCD860] focus-within:shadow-md">
                  <textarea
                    placeholder="Type your message..."
                    className="w-full h-[60px] resize-none border-0 p-2 text-[14px] font-medium outline-none text-[#0A4027] placeholder:text-[#8B9B91] bg-transparent"
                  ></textarea>

                  <div className="flex justify-between items-center mt-2 px-1">
                    {/* Formatting / Attachment Buttons */}
                    <div className="flex gap-1.5">
                      <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F3ED] transition-colors text-[#8B9B91] hover:text-[#0A4027]">
                        <svg fill="none" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="currentColor" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                      </button>
                      <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F3ED] transition-colors text-[#8B9B91] hover:text-[#0A4027]">
                        <svg fill="none" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Send Button */}
                    <button type="button" className="w-10 h-10 bg-[#F0A500] hover:bg-[#D26900] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(240,165,0,0.4)] transition-all hover:scale-105 active:scale-95 text-white">
                      <svg fill="none" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" stroke="currentColor" d="M12 5L12 20"></path>
                        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" stroke="currentColor" d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Wavy Divider before Footer */}
      <div className="w-full overflow-hidden leading-[0] bg-[#E3E8CD] -mt-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px]">
          <path d="M0 100C180 50 360 0 540 40C720 80 900 100 1080 60C1260 20 1380 10 1440 50V100H0Z" fill="#FBF7F0" />
        </svg>
      </div>
    </div>
  );
}