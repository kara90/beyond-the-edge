"use client";

import { useEffect } from "react";

/*
  Spotlight — one global pointer listener that publishes the cursor position to
  CSS custom properties on <html>:

    --spot-x, --spot-y  cursor position in viewport pixels
    --spot-xp           cursor x as 0..1 (drives the hue drift blue -> cyan)

  The `.spotlight-edge` utility (globals.css) reads these to light the edge of
  any card, photo, or video frame. Because that glow uses
  background-attachment: fixed, a single global coordinate correctly lights
  whichever framed element the cursor happens to be over.

  Only runs on real pointers (hover + fine), so touch devices and
  reduced-motion users get the calm static frames and no repaint cost.
  rAF-throttled to one write per frame.
*/
export default function Spotlight() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduce.matches) return;

    const root = document.documentElement;
    let raf = 0;
    let nx = 0;
    let ny = 0;

    const flush = () => {
      raf = 0;
      root.style.setProperty("--spot-x", nx.toFixed(1));
      root.style.setProperty("--spot-y", ny.toFixed(1));
      root.style.setProperty(
        "--spot-xp",
        (nx / Math.max(1, window.innerWidth)).toFixed(3)
      );
    };

    const onMove = (e) => {
      nx = e.clientX;
      ny = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
