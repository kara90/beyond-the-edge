"use client";

import { useEffect, useRef } from "react";
import { isLite, onLite } from "@/components/site/perf";

/*
  Liquid water distortion that reacts to the cursor like a finger on water.

  One shared SVG displacement filter (#hf-liquid) whose strength is driven by
  how fast you move the pointer (and how fast you scroll). While you are moving,
  the water is "disturbed"; when you stop, it settles back to flat and the
  filter is removed entirely (idle cost zero).

  What ripples: only the grid + the background videos (class .hf-liquid) react,
  like a surface the cursor passes over. Cards/squares are deliberately NOT
  distorted: the displacement filter fringed their edges (black artifacts) and,
  by establishing a filter containing block, broke the background-attachment:
  fixed that the .spotlight-edge neon glow relies on, so the edge glow stopped
  tracking the cursor. Keeping the filter off cards fixes both.

  Only a handful of elements are ever filtered at once, so it stays smooth.
  Desktop + motion-allowed only.
*/

export default function LiquidFilter() {
  const turbRef = useRef(null);
  const dispRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;
    if (isLite()) return;

    const root = document.documentElement;
    let raf = 0;
    let scale = 0;
    let target = 0;
    let phase = 0;
    let lastActiveAt = 0;

    let px = -1;
    let py = -1;
    let lastTP = performance.now();
    let lastSY = window.scrollY;
    let lastTS = performance.now();

    // Gentle, organic water: small floor, modest cap, builds and settles
    // slowly so it never snaps in.
    const FLOOR = 1.5;
    const CAP = 9;

    const wake = (speed, k) => {
      target = Math.min(CAP, Math.max(FLOOR, speed * k));
      lastActiveAt = performance.now();
      root.classList.add("hf-liquid-on");
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - lastTP);
      if (px >= 0) {
        const sp = (Math.hypot(e.clientX - px, e.clientY - py) / dt) * 1000;
        wake(sp, 0.009);
      }
      px = e.clientX;
      py = e.clientY;
      lastTP = now;
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastTS);
      const sp = (Math.abs(window.scrollY - lastSY) / dt) * 1000;
      lastSY = window.scrollY;
      lastTS = now;
      wake(sp, 0.012);
    };

    const loop = () => {
      const now = performance.now();
      if (now - lastActiveAt > 160) target = 0;
      // Slow lerp so the water swells and settles instead of snapping in.
      scale += (target - scale) * 0.06;
      phase += 0.0022;

      if (dispRef.current) dispRef.current.setAttribute("scale", scale.toFixed(2));
      if (turbRef.current) {
        // Low frequency = broad, smooth swells (water), gently drifting.
        const bf = 0.0062 + Math.sin(phase) * 0.0011;
        turbRef.current.setAttribute(
          "baseFrequency",
          `${bf.toFixed(4)} ${(bf * 1.3).toFixed(4)}`
        );
      }

      if (target === 0 && scale < 0.12) {
        scale = 0;
        dispRef.current?.setAttribute("scale", "0");
        root.classList.remove("hf-liquid-on");
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    let torn = false;
    const cleanup = () => {
      if (torn) return;
      torn = true;
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.classList.remove("hf-liquid-on");
    };
    const unsubLite = onLite(cleanup);
    return () => {
      cleanup();
      unsubLite();
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ width: 0, height: 0, position: "absolute" }}
    >
      <defs>
        <filter
          id="hf-liquid"
          x="-6%"
          y="-6%"
          width="112%"
          height="112%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.0062 0.008"
            numOctaves="3"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
