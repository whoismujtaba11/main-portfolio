"use client";

import { useEffect, useState } from "react";

// A curtain that covers the whole page until fonts have loaded and a
// short minimum delay has passed, then fades out. Without this, the
// giant Humane hero text jumps in size once the custom font swaps in for
// the fallback, and the page just snaps into view — this hides that
// settling behind a smooth fade instead.
export default function PageReveal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 400));
    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();
    const fallbackTimeout = new Promise<void>((resolve) =>
      setTimeout(resolve, 2500),
    );

    Promise.all([minDelay, Promise.race([fontsReady, fallbackTimeout])]).then(
      () => {
        if (!cancelled) setReady(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] bg-[#0c0a14] transition-opacity duration-700 ease-out ${
        ready ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
