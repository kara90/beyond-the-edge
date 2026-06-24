"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useReducedMotion } from "framer-motion";

/*
  Rock — a little 3D rock that floats in the dark and turns as you scroll.

  The source clips are renders of a rock rotating on a (near) black background.
  mix-blend-mode: screen drops that dark background into the page so only the
  lit rock shows: it reads as a floating 3D object, not a video in a box. A
  radial feather softens the edges as a safety net.

  The 360 is scroll-scrubbed (like the hero): the rock's currentTime eases to
  its position in the viewport, so it turns one way on scroll-down and back on
  scroll-up. Each rock arms (loads) only when it nears the viewport and only
  scrubs while on screen, so several can live on the page cheaply.
  prefers-reduced-motion: a still frame.
*/
export const ROCK_SRCS = [
  "https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b950e6a414441905e8ade.mp4",
  "https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b950e817563b473c5f5e6.mp4",
  "https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b950eae7d47683935f999.mp4",
  "https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b950e659bec99fcd04e9e.mp4",
];

const FEATHER = "radial-gradient(closest-side, #000 56%, transparent 100%)";

export default function Rock({
  src,
  size = 150,
  spins = 1,
  opacity = 0.85,
  className = "",
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [armed, setArmed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  // Load only when the rock nears the viewport (don't fetch all clips up front).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scrub the rotation from scroll position while on screen.
  useEffect(() => {
    if (!armed) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();

    if (reduce) {
      const set = () => {
        try {
          v.currentTime = Math.min(0.1, (v.duration || 1) / 2);
        } catch {}
      };
      if (v.readyState >= 1) set();
      else v.addEventListener("loadedmetadata", set, { once: true });
      return;
    }

    let raf = 0;
    let target = 0;
    let cur = 0;
    let inView = true;
    const unsub = scrollYProgress.on("change", (p) => {
      target = p;
    });

    const loop = () => {
      const dur = v.duration && Number.isFinite(v.duration) ? v.duration : 1;
      cur += (target - cur) * 0.1;
      const frac = (((cur * spins) % 1) + 1) % 1;
      const t = Math.min(dur - 0.03, Math.max(0, frac * dur));
      if (Number.isFinite(t) && Math.abs(v.currentTime - t) > 0.02) {
        try {
          v.currentTime = t;
        } catch {}
      }
      raf = inView ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && !raf) raf = requestAnimationFrame(loop);
      },
      { rootMargin: "120px" }
    );
    if (wrapRef.current) io.observe(wrapRef.current);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      io.disconnect();
    };
  }, [armed, reduce, scrollYProgress, spins]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <video
        ref={videoRef}
        src={armed ? src : undefined}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover mix-blend-screen"
        style={{
          opacity,
          maskImage: FEATHER,
          WebkitMaskImage: FEATHER,
        }}
      />
    </div>
  );
}
