"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

type Ghost = { id: number; char: string };

type Props = {
  text: string;
  className?: string;
  /** How long each character scrambles before locking in, in ms. */
  charDuration?: number;
  /** How often a new ghost glyph spawns on the active character, in ms. */
  tick?: number;
  /** How long each ghost glyph takes to fade out, in ms. */
  ghostFade?: number;
};

// A single flipped glyph that fades/blurs itself out once, on mount, via
// the Web Animations API. Driven imperatively (rather than a declarative
// CSS animation class) so the parent's frequent re-renders while
// scrambling can't reset it mid-flight.
function GhostGlyph({ char, duration }: { char: string; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ref.current?.animate(
      [
        { opacity: 1, filter: "blur(0px)", transform: "translateY(0) scale(1)" },
        {
          opacity: 0,
          filter: "blur(8px)",
          transform: "translateY(-0.05em) scale(1.04)",
        },
      ],
      { duration, easing: "ease-out", fill: "forwards" },
    );
  }, [duration]);

  return (
    <span ref={ref} className="pointer-events-none absolute inset-0">
      {char}
    </span>
  );
}

// Scrambles one character at a time, left to right. Each flip of the
// active character spawns a "ghost" glyph that fades/blurs out over
// ghostFade ms instead of being replaced instantly, so several recent
// glyphs overlap and decay like a motion-blur trail rather than a hard,
// choppy swap. Characters not yet reached are reserved (final glyph,
// invisible) so layout width is stable from the first paint.
export default function ScrambleText({
  text,
  className,
  charDuration = 180,
  tick = 50,
  ghostFade = 260,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const idRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (activeIndex >= text.length) return;

    if (text[activeIndex] === " ") {
      setActiveIndex((i) => i + 1);
      return;
    }

    setGhosts([]);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const spawnGhost = () => {
      const id = idRef.current++;
      setGhosts((g) => [...g, { id, char: randomChar() }]);
      const t = setTimeout(() => {
        setGhosts((g) => g.filter((gh) => gh.id !== id));
      }, ghostFade);
      timeoutsRef.current.push(t);
    };

    spawnGhost();
    const flips = Math.max(1, Math.round(charDuration / tick));
    let flipCount = 0;

    const interval = setInterval(() => {
      flipCount++;
      if (flipCount >= flips) {
        clearInterval(interval);
        setActiveIndex((i) => i + 1);
      } else {
        spawnGhost();
      }
    }, tick);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [activeIndex, text, charDuration, tick, ghostFade]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => {
        if (i < activeIndex || char === " ") {
          return <span key={i}>{char}</span>;
        }
        if (i === activeIndex) {
          return (
            <span key={i} className="relative inline-block">
              <span style={{ opacity: 0 }}>{char}</span>
              {ghosts.map((g) => (
                <GhostGlyph key={g.id} char={g.char} duration={ghostFade} />
              ))}
            </span>
          );
        }
        return (
          <span key={i} style={{ opacity: 0 }}>
            {char}
          </span>
        );
      })}
    </span>
  );
}
