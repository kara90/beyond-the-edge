"use client";

import { useEffect, useRef } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import CineGrain from "@/components/site/cine-grain";

/*
  ScrubVideo — a background video that does NOT play on its own. Its playhead
  follows scroll position (like the hero): the clip advances as the section
  passes up through the viewport and reverses on scroll-up. Eased for a smooth,
  premium scrub, and it only seeks while the section is on screen.

  `className` styles the full-bleed wrapper (positioning, feather, blend);
  `videoClassName` styles the <video> (object-fit, opacity).
  prefers-reduced-motion: a still frame.
*/
export default function ScrubVideo({
  src,
  className = "",
  videoClassName = "",
  videoStyle,
  grain = false,
  spins = 1,
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();

    const paint = () => {
      try {
        if (v.currentTime < 0.04) v.currentTime = 0.04;
      } catch {}
    };
    if (v.readyState >= 1) paint();
    else v.addEventListener("loadedmetadata", paint, { once: true });

    if (reduce) return;

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
      { rootMargin: "150px" }
    );
    if (wrapRef.current) io.observe(wrapRef.current);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      io.disconnect();
    };
  }, [reduce, scrollYProgress, spins]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={className}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className={videoClassName}
        style={videoStyle}
      />
      {grain && <CineGrain opacity={0.26} />}
    </div>
  );
}
