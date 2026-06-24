"use client";

import { useEffect, useRef } from "react";

/*
  Site-wide grid. A faint steel-cyan grid sits behind the whole page; a brighter
  copy is revealed in a soft circle that follows the cursor (driven by the
  --spot-x / --spot-y vars the Spotlight component already publishes, so the
  reveal lines up with the real pointer). The grid drifts slowly for life and
  carries the .hf-liquid class so it ripples while the page is scrolling.
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
  const baseRef = useRef(null);
  const revealRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let off = 0;
    const loop = () => {
      off = (off + SPEED) % CELL;
      const pos = `${off}px ${off}px`;
      if (baseRef.current) baseRef.current.style.backgroundPosition = pos;
      if (revealRef.current) revealRef.current.style.backgroundPosition = pos;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className={`hf-liquid ${className}`}>
      <div ref={baseRef} className="absolute inset-0" style={gridStyle("0.05")} />
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{
          ...gridStyle("0.2"),
          maskImage: REVEAL_MASK,
          WebkitMaskImage: REVEAL_MASK,
        }}
      />
    </div>
  );
}
