"use client";
import { useEffect } from "react";

/**
 * Lightweight wrapper that runs the Intersection + Mutation Observer
 * for scroll-reveal animations on elements inside the footer.
 * Lives in layout.tsx so footer .reveal elements get observed too.
 */
export default function RevealObserver({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    const mo = new MutationObserver(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return <>{children}</>;
}
