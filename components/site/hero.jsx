"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import ButtonLink from "@/components/site/button-link";
import CineGrain from "@/components/site/cine-grain";
import BeamsLayer from "@/components/site/beams-layer";
import { isLite, onLite } from "@/components/site/perf";

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
// Served from the site's own CDN, re-encoded all-intra (every frame a
// keyframe, ~37KB) and faststart (metadata first), and the CDN honors byte
// ranges. So the scrub can seek to any frame instantly by pulling only that
// frame's bytes, and the clip streams progressively instead of loading whole.
const HERO_VIDEO = "/media/hero.mp4";
// Still frame used as the hero on lite and reduced-motion devices (no video
// at all) and as the poster while the scrub clip loads.
const HERO_POSTER = "/media/hero-poster.webp";
const FALLBACK_DURATION = 15;
// The clip fades in from black; open on the flower scene and end just shy of
// the final frame so the hero never shows a black edge.
const HERO_START = 0.5;
const HERO_END_TRIM = 0.1;

export default function Hero() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  // On weak/janking devices, drop the pinned scroll-scrub for a simple
  // autoplaying hero so scrolling stays smooth.
  const [lite, setLite] = useState(false);

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
  // Persistent mini CTA: fades in once the headline has cleared, then stays
  // with the viewer for the whole pinned scrub.
  const miniCtaOpacity = useTransform(scrollYProgress, [0.16, 0.24], [0, 1]);
  const miniCtaPointer = useTransform(scrollYProgress, (p) =>
    p > 0.16 ? "auto" : "none"
  );
  // Once the headline has faded, its (invisible) buttons must stop catching
  // taps for the rest of the pinned scrub.
  const copyPointer = useTransform(scrollYProgress, (p) =>
    p > 0.14 ? "none" : "auto"
  );

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

    if (reduce || lite) return;

    // Stream the scrub clip progressively. The clip is faststart (metadata
    // first) and all-intra (every frame a keyframe, ~37KB), and the CDN honors
    // byte-range requests, so the browser gets metadata almost immediately and
    // then pulls only the small byte range for each frame it seeks to. A weak
    // connection just means a given frame arrives a touch late; it never blocks
    // the whole hero and never forces a downgrade. Kick the load explicitly so
    // the fetch starts even if the element was mounted idle.
    try {
      v.load();
    } catch {}

    // Downgrade to the still hero only when the clip genuinely cannot play.
    // An unsupported source (code 4) is hopeless, so drop immediately. A
    // network dip (code 2) or a one-off decode glitch on a corrupt byte range
    // (code 3) is retried instead: the retry budget resets on any successful
    // recovery (onRecover) so independent transient stalls never accumulate
    // into a permanent downgrade. Only a sustained, unrecoverable streak of
    // failures (three retries with no recovery in between) gives up. This is
    // what keeps a strong machine on weak wifi from ever losing the scrub.
    let netRetries = 0;
    const onRecover = () => {
      netRetries = 0;
    };
    const onError = () => {
      const code = v.error && v.error.code;
      if (code === 4) {
        setLite(true);
      } else if (netRetries < 3) {
        netRetries += 1;
        try {
          v.load();
        } catch {}
      } else {
        setLite(true);
      }
    };
    v.addEventListener("error", onError);
    // Any of these firing means the stream is healthy again; reset the budget.
    v.addEventListener("canplay", onRecover);
    v.addEventListener("seeked", onRecover);
    v.addEventListener("loadeddata", onRecover);

    let raf = 0;
    let running = false;
    let target = 0;
    let cur = 0;
    const unsub = scrollYProgress.on("change", (p) => {
      target = p;
    });

    const loop = () => {
      // Skip seeking while the tab is hidden or before the clip has metadata
      // (hammering currentTime on an unready element can wedge its loader);
      // keep the loop alive so it resumes seamlessly.
      if (!document.hidden && v.readyState >= 1) {
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
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };
    start();

    // Cancel the rAF loop entirely while the track is far off-screen, and
    // restart it as the viewer scrolls back toward the hero.
    let io;
    if (typeof IntersectionObserver !== "undefined" && trackRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) start();
          else stop();
        },
        { rootMargin: "100%" }
      );
      io.observe(trackRef.current);
    }

    return () => {
      stop();
      unsub();
      if (io) io.disconnect();
      v.removeEventListener("error", onError);
      v.removeEventListener("canplay", onRecover);
      v.removeEventListener("seeked", onRecover);
      v.removeEventListener("loadeddata", onRecover);
    };
  }, [reduce, lite, scrollYProgress]);

  // Detect a weak/janking device and switch the hero to the lite path.
  useEffect(() => {
    if (isLite()) {
      setLite(true);
      return;
    }
    return onLite(() => setLite(true));
  }, []);

  // Reduced motion: a calm, static opening frame with the copy.
  if (reduce) {
    return (
      <section data-fluid-off className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <img
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/50"
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

  // Lite path: a single-screen hero showing a still cinematic frame (no video,
  // no scrub, no WebGL), so weak devices stay completely flat and smooth.
  if (lite) {
    return (
      <section data-fluid-off className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <img
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 30%, transparent 40%, oklch(0.1 0.02 268 / 0.55) 100%)",
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
      data-fluid-off
      className="relative h-[360vh]"
    >
      {/* Pinned cinematic stage */}
      <div className="sticky top-0 isolate flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.video
          ref={videoRef}
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale }}
        />

        {/* Constant cinematic darkening (about half black) so the copy stays
            readable over bright frames and the poster */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/50"
        />

        {/* Cinematic grain over the footage */}
        <CineGrain opacity={0.18} />

        {/* Ambient light-beam aura over the footage */}
        <BeamsLayer className="z-[2]" opacity={0.7} intensity="medium" />

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
          style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyPointer }}
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

        {/* Persistent mini CTA: rides the whole pinned scrub once the copy clears */}
        <motion.div
          className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: miniCtaOpacity, pointerEvents: miniCtaPointer }}
        >
          <ButtonLink
            href="#contact"
            data-cta-id="hero-mini-claim-slot"
            className="sheen h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_28px_-6px_var(--primary)]"
          >
            Claim your build slot
          </ButtonLink>
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
        Websites · Automation · Video · Apps
      </span>
      <h1 className="font-display text-balance text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
        Your website is quietly costing you customers.
        <span className="mt-3 block text-metallic glow-edge">
          We build the kind that wins them.
        </span>
      </h1>
      <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        Studio-grade websites and cinematic video for business owners done with
        template looks and $15,000 agency quotes. Real craft, accelerated by
        AI, so it ships in weeks and costs a fraction of the big-agency price.
      </p>
      <div className="mx-auto mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink
          href="#contact"
          size="lg"
          data-cta-id="hero-claim-slot"
          className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
        >
          Claim your build slot
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
        <ButtonLink
          href="#work"
          variant="outline"
          size="lg"
          data-cta-id="hero-see-proof"
          className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-[0.95rem] text-foreground backdrop-blur-sm transition-all duration-300 hover:border-edge/40 hover:bg-white/[0.06]"
        >
          See the proof
        </ButtonLink>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/80">
        Free scope. A straight answer on plan, price, and timeline within one
        business day.
      </p>

      <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground/60">
        Limited builds each month · founder-led · live in weeks
      </p>
    </>
  );
}
