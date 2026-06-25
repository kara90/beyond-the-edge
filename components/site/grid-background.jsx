"use client";

import { useEffect, useRef } from "react";
import { isLite, onLite } from "@/components/site/perf";

/*
  Site-wide grid. The grid is invisible by default and only appears in a soft
  circle that follows the cursor, so it reveals itself wherever you move over
  the page (driven by the --spot-x / --spot-y vars the Spotlight component
  publishes, so it lines up with the real pointer). It drifts slowly for life
  and carries the .hf-liquid class so it ripples while the page is scrolling.
  Decorative, pointer-safe, reduced-motion aware.
*/
const CELL = 44;
const SPEED = 0.25;
const LINE = "rgba(150, 196, 232,";

const gridStyle = (alpha) => ({
  backgroundImage: `linear-gradient(to right, ${LINE}${alpha}) 1px, transparent 1px), linear-gradient(to bottom, ${LINE}${alpha}) 1px, transparent 1px)`,
  backgroundSize: `${CELL}px ${CELL}px`,
});

const REVEAL_MASK =
  "radial-gradient(320px circle at calc(var(--spot-x, -1000) * 1px) calc(var(--spot-y, -1000) * 1px), #000 0%, transparent 72%)";

export default function GridBackground({ className = "" }) {
  const revealRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isLite()) return;
    let raf = 0;
    let off = 0;
    const loop = () => {
      off = (off + SPEED) % CELL;
      if (revealRef.current)
        revealRef.current.style.backgroundPosition = `${off}px ${off}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const stop = () => cancelAnimationFrame(raf);
    const unsub = onLite(stop);
    return () => {
      stop();
      unsub();
    };
  }, []);

  // No always-on base grid: the grid only exists inside the cursor reveal,
  // so it shows up wherever you move over the page and nowhere else.
  return (
    <div aria-hidden="true" className={`grid-bg hf-liquid ${className}`}>
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{
          ...gridStyle("0.36"),
          maskImage: REVEAL_MASK,
          WebkitMaskImage: REVEAL_MASK,
        }}
      />
    </div>
  );
}
