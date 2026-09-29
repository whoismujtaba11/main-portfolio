"use client";

import { useEffect, useRef, useState } from "react";

type Scene = {
  key: string;
  src: string;
  fallback: string;
  /** Section id whose scroll progress drives this scene's opacity. Omit for the base layer. */
  triggerSection?: string;
};

const SCENES: Scene[] = [
  {
    key: "dusk",
    src: "https://fluid.krackeddevs.com/#p=0.88,1.44,3.8,0.058,1,8,0,3,16.99,0.8,0.85,1,0,1,22",
    fallback: "/assets/fluid-bg.jpg",
  },
  {
    key: "light",
    src: "https://fluid.krackeddevs.com/#p=0.88,1.44,3.8,0.058,1,8,0,8,16.99,0.8,0.85,1,0,1,22,0,0,0,0,0,16710877,5847180,11763140,16239838",
    fallback: "/assets/fluid-bg-projects.jpg",
    // crossfades in during Home, fully in by the top of About — so
    // About/Projects/Experience read as the "white" theme
    triggerSection: "home",
  },
  {
    key: "green",
    src: "https://fluid.krackeddevs.com/#p=0.88,1.44,3.8,0.058,1,8,0,8,16.99,0.8,0.85,1,0,1,22,0,0,0,0,0,6724661,13951998,11763140,16239838",
    fallback: "/assets/fluid-bg-contact.jpg",
    // crossfades in during Experience, fully in by the top of Contact
    triggerSection: "experience",
  },
];

const TRACKED_SECTIONS = SCENES.map((s) => s.triggerSection).filter(
  (id): id is string => Boolean(id),
);

function sectionProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const height = el.offsetHeight || 1;
  return Math.min(1, Math.max(0, -rect.top / height));
}

// Fixed, full-bleed background made of stacked Fluid scenes. Each scene
// above the base crossfades in as the visitor scrolls through its
// trigger section, so the background finishes transitioning right as the
// next section reaches the top of the viewport. Every scene has a static
// JPEG painted first (and as the permanent fallback if Fluid is ever
// offline/blocked) under its live iframe. Sits behind all content and
// never intercepts clicks/scroll.
export default function FluidBackground() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const els = TRACKED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (els.length === 0) return;

    const update = () => {
      rafRef.current = null;
      const next: Record<string, number> = {};
      for (const el of els) next[el.id] = sectionProgress(el);
      setProgress(next);
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
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0c0a14]"
    >
      {SCENES.map((scene) => {
        const opacity = scene.triggerSection
          ? (progress[scene.triggerSection] ?? 0)
          : 1;
        return (
          <div key={scene.key}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${scene.fallback})`, opacity }}
            />
            <iframe
              src={scene.src}
              title={`Fluid generative background (${scene.key})`}
              loading="lazy"
              className="absolute inset-0 block h-full w-full border-0"
              style={{ opacity }}
            />
          </div>
        );
      })}
    </div>
  );
}
