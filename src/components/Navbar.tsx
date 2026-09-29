"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

function sectionProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const height = el.offsetHeight || 1;
  return Math.min(1, Math.max(0, -rect.top / height));
}

// The background cycles purple -> white -> green as the page scrolls, so
// the fixed navbar flips between a light-on-dark and dark-on-light glass
// style to stay legible. It switches at the midpoint of the same
// crossfades FluidBackground uses (home->about, experience->contact).
export default function Navbar() {
  const [light, setLight] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const homeEl = document.getElementById("home");
    const experienceEl = document.getElementById("experience");
    if (!homeEl || !experienceEl) return;

    const update = () => {
      rafRef.current = null;
      const enteredWhite = sectionProgress(homeEl) >= 0.5;
      const enteredGreen = sectionProgress(experienceEl) >= 0.5;
      setLight(enteredWhite && !enteredGreen);
    };

    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
      {/* Hidden filter feeding the .liquid-glass backdrop-filter: a touch
          of turbulence pushed through a displacement map bends whatever's
          behind the navbar, like light refracting through glass. */}
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="liquid-glass-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves="2"
            seed="17"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <nav
        aria-label="Primary"
        className={`liquid-glass flex items-center gap-0.5 rounded-full border px-2 py-2 transition-colors duration-300 sm:gap-1 sm:px-3 ${
          light
            ? "border-black/10 bg-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            : "border-white/15 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        }`}
      >
        {LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
              light
                ? "text-zinc-900/70 hover:bg-black/5 hover:text-zinc-900"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
