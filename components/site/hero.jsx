"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import ButtonLink from "@/components/site/button-link";
import CineGrain from "@/components/site/cine-grain";

/*
  HERO — a scroll-scrubbed cinematic.

  The hero pins to the viewport across a tall scroll track. Scroll progress is
  mapped to the video's currentTime, so scrolling plays the 15s animation
  frame-by-frame (it opens on the flower, then the rocket sequence unfolds).
  The video time is eased toward the scroll target each frame for a smooth,
  premium scrub instead of hard seeks. Because the hero is pinned, you cannot
  reach the content below until you have scrolled the whole track, i.e. until
  the animation has played all the way through.

  A subtle scroll-linked push-in adds depth; the copy fades early so the
  animation is seen cleanly. prefers-reduced-motion: a still first frame.
*/
const HERO_VIDEO =
  "https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b92b86a414441905e543b.mp4";
const FALLBACK_DURATION = 15;
// The clip fades in from black; open on the flower scene and end just shy of
// the final frame so the hero never shows a black edge.
const HERO_START = 0.5;
const HERO_END_TRIM = 0.1;

export default function Hero() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Copy clears early so the animation reads cleanly; gentle cinematic push-in.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.2], [0, -44]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  // Scrim is present only while the copy shows, then clears so the animation
  // reveal is unobstructed as you scroll into it.
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();

    // Paint the opening frame (the flower) before any scroll.
    const paintFirst = () => {
      try {
        if (v.currentTime < HERO_START) v.currentTime = HERO_START;
      } catch {}
    };
    if (v.readyState >= 1) paintFirst();
    else v.addEventListener("loadedmetadata", paintFirst, { once: true });

    if (reduce) return;

    let raf = 0;
    let target = 0;
    let cur = 0;
    const unsub = scrollYProgress.on("change", (p) => {
      target = p;
    });

    const loop = () => {
      const dur = v.duration && Number.isFinite(v.duration) ? v.duration : FALLBACK_DURATION;
      const end = dur - HERO_END_TRIM;
      // Ease the playhead toward the scroll target for a smooth, premium scrub,
      // mapped into the visible range [HERO_START, end].
      cur += (target - cur) * 0.12;
      const t = Math.min(end, Math.max(HERO_START, HERO_START + cur * (end - HERO_START)));
      if (Number.isFinite(t) && Math.abs(v.currentTime - t) > 0.015) {
        try {
          v.currentTime = t;
        } catch {}
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, [reduce, scrollYProgress]);

  // Reduced motion: a calm, static opening frame with the copy.
  if (reduce) {
    return (
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 30%, transparent 40%, oklch(0.1 0.02 268 / 0.45) 100%)",
          }}
        />
        <div className="relative z-10">
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      aria-label="Beyond the Edge Studio"
      className="relative h-[360vh]"
    >
      {/* Pinned cinematic stage */}
      <div className="sticky top-0 isolate flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.video
          ref={videoRef}
          src={HERO_VIDEO}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale }}
        />

        {/* Cinematic grain over the footage */}
        <CineGrain opacity={0.1} />

        {/* Soft vignette for depth + readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 28%, transparent 42%, oklch(0.1 0.02 268 / 0.4) 100%)",
          }}
        />
        {/* Readability scrim behind the copy (fades out as the animation reveals) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: scrimOpacity,
            background:
              "linear-gradient(to bottom, oklch(0.08 0.02 268 / 0.35) 0%, oklch(0.08 0.02 268 / 0.5) 55%, oklch(0.08 0.02 268 / 0.35) 100%)",
          }}
        />
        {/* Bottom blend into the page so the unpin is seamless */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--background))",
          }}
        />

        {/* Headline (clears early so the animation is seen cleanly) */}
        <motion.div
          className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <HeroCopy />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
          style={{ opacity: cueOpacity }}
        >
          <span className="eyebrow block">Scroll</span>
          <span className="mx-auto mt-2 flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-edge" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* Shared hero copy block (used by both the live and reduced-motion hero). */
function HeroCopy() {
  return (
    <>
      <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-edge/35 bg-white/[0.07] px-4 py-2 font-mono text-xs uppercase tracking-[0.26em] text-foreground/90 shadow-[0_0_26px_-8px_var(--edge)] backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-edge shadow-[0_0_10px_2px_var(--edge)]" />
        Websites · Cinematic video · Growth
      </span>
      <h1 className="font-display text-balance text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
        Most brands stay
        <br className="hidden sm:block" /> inside the lines.
        <span className="mt-3 block text-metallic glow-edge">
          We go beyond the edge.
        </span>
      </h1>
      <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        High-end websites and cinematic video for businesses ready to look like
        the leader in their market. Major-brand quality, without the major-brand
        agency price.
      </p>
      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <ButtonLink
          href="#contact"
          size="lg"
          className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
        >
          Start your project
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
        <ButtonLink
          href="#work"
          variant="outline"
          size="lg"
          className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-[0.95rem] text-foreground backdrop-blur-sm transition-all duration-300 hover:border-edge/40 hover:bg-white/[0.06]"
        >
          See the work
        </ButtonLink>
      </div>

      <p className="mt-7 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground/60">
        Trusted by brands that refuse to blend in
      </p>
    </>
  );
}
