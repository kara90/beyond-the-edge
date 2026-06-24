"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import { ROCK_SRCS } from "@/components/site/rock";

/*
  RockDivider — a small 3D rock that sits centered in the gap between two
  sections. It PINS in place (sticky) while you scroll through its track and
  slowly turns 360 (scroll-scrubbed, like the hero), then releases. It does not
  drift; only the rotation animates.

  mix-blend-screen drops the clip's near-black background into the page so the
  full rock shows with no box; a soft radial feather hides any frame edge.
  Loads only near the viewport and only scrubs while on screen. Desktop/tablet
  only; reduced-motion shows a still frame.
*/
export { ROCK_SRCS };

const FEATHER = "radial-gradient(closest-side, #000 72%, transparent 100%)";

export default function RockDivider({
  src,
  size = 120,
  trackVh = 56,
  spins = 1,
  opacity = 0.95,
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [armed, setArmed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "1400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();

    // Paint a visible frame as soon as the clip loads so the rock shows up
    // even before it is scrolled through (it would otherwise be blank).
    const paintFirst = () => {
      try {
        if (v.currentTime < 0.05) v.currentTime = (v.duration || 4) * 0.4;
      } catch {}
    };
    if (v.readyState >= 1) paintFirst();
    else v.addEventListener("loadedmetadata", paintFirst, { once: true });

    if (reduce) {
      const set = () => {
        try {
          v.currentTime = (v.duration || 4) * 0.3;
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
      { rootMargin: "100px" }
    );
    io.observe(trackRef.current);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      io.disconnect();
    };
  }, [armed, reduce, scrollYProgress, spins]);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none relative hidden w-full md:block"
      style={{ height: `${trackVh}vh` }}
    >
      <div className="sticky top-[42vh] flex w-full justify-center">
        <video
          ref={videoRef}
          src={armed ? src : undefined}
          muted
          playsInline
          preload="auto"
          className="object-contain mix-blend-screen"
          style={{
            width: size,
            height: size,
            opacity,
            maskImage: FEATHER,
            WebkitMaskImage: FEATHER,
          }}
        />
      </div>
    </div>
  );
}
