"use client";

import { useEffect, useRef } from "react";

/*
  Liquid water distortion that reacts to the cursor like a finger on water.

  One shared SVG displacement filter (#hf-liquid) whose strength is driven by
  how fast you move the pointer (and how fast you scroll). While you are moving,
  the water is "disturbed"; when you stop, it settles back to flat and the
  filter is removed entirely (idle cost zero).

  What ripples:
    - the grid + the background videos (class .hf-liquid) react to any movement,
      like a surface the cursor passes over;
    - the single block/card directly under the cursor (.hf-rippling) gets the
      localized "touch" ripple, so the water distorts right where you are.

  Only a handful of elements are ever filtered at once, so it stays smooth.
  Desktop + motion-allowed only.
*/
const TARGET_SELECTOR = ".spotlight-edge";

export default function LiquidFilter() {
  const turbRef = useRef(null);
  const dispRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

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
    let current = null; // block currently receiving the localized ripple

    const FLOOR = 3;
    const CAP = 15;

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
        wake(sp, 0.015);
      }
      px = e.clientX;
      py = e.clientY;
      lastTP = now;

      // Localize: ripple the block the cursor is actually over.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const block = el ? el.closest(TARGET_SELECTOR) : null;
      if (block !== current) {
        if (current) current.classList.remove("hf-rippling");
        current = block;
        if (current) current.classList.add("hf-rippling");
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastTS);
      const sp = (Math.abs(window.scrollY - lastSY) / dt) * 1000;
      lastSY = window.scrollY;
      lastTS = now;
      wake(sp, 0.02);
    };

    const loop = () => {
      const now = performance.now();
      if (now - lastActiveAt > 110) target = 0;
      scale += (target - scale) * 0.16;
      phase += 0.004;

      if (dispRef.current) dispRef.current.setAttribute("scale", scale.toFixed(2));
      if (turbRef.current) {
        const bf = 0.011 + Math.sin(phase) * 0.0018;
        turbRef.current.setAttribute(
          "baseFrequency",
          `${bf.toFixed(4)} ${(bf * 1.35).toFixed(4)}`
        );
      }

      if (target === 0 && scale < 0.25) {
        scale = 0;
        dispRef.current?.setAttribute("scale", "0");
        root.classList.remove("hf-liquid-on");
        if (current) {
          current.classList.remove("hf-rippling");
          current = null;
        }
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.classList.remove("hf-liquid-on");
      if (current) current.classList.remove("hf-rippling");
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
            baseFrequency="0.011 0.015"
            numOctaves="2"
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
