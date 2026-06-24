"use client";

import { useEffect, useRef } from "react";

/*
  Liquid water distortion. Renders one SVG displacement filter (#hf-liquid) and
  drives it from scroll velocity: the faster you scroll, the more the grid and
  the background videos ripple, settling smoothly back to flat when you stop.

  Anything with the .hf-liquid class gets `filter: url(#hf-liquid)` ONLY while
  html.hf-scrolling is set, so when the page is still the filter is removed
  entirely and idle cost is zero. Desktop + motion-allowed only.
*/
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
    let lastY = window.scrollY;
    let lastT = performance.now();
    let lastScrollAt = 0;

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const v = (Math.abs(window.scrollY - lastY) / dt) * 1000; // px per second
      // Guaranteed floor while moving so the water is always visible on scroll,
      // scaling up to a firm cap with speed.
      target = Math.min(18, Math.max(4, v * 0.02));
      lastY = window.scrollY;
      lastT = now;
      lastScrollAt = now;
      root.classList.add("hf-scrolling");
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const loop = () => {
      const now = performance.now();
      if (now - lastScrollAt > 110) target = 0;
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

      // Settle: once flat and not scrolling, drop the filter (zero idle cost).
      if (target === 0 && scale < 0.25) {
        scale = 0;
        dispRef.current?.setAttribute("scale", "0");
        root.classList.remove("hf-scrolling");
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.classList.remove("hf-scrolling");
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
