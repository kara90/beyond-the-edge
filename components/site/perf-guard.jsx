"use client";

import { useEffect } from "react";
import { isLite, setLite } from "@/components/site/perf";

/*
  PerfGuard — watches the real frame rate continuously for the first several
  seconds (not just once at load) and switches the site to lite mode if the
  page is janking, which sheds the heavy GPU effects AND the decorative
  background videos. Catches jank that only appears during scroll/interaction.
  Skips the probe if coarse hints already flagged the device as lite, and
  ignores windows where the tab was hidden (rAF throttling would look like
  jank otherwise).
*/
export default function PerfGuard() {
  useEffect(() => {
    if (isLite()) return;

    const WARMUP = 1000; // skip initial load/hydration jank
    const WINDOW = 1000; // measure in 1s windows
    const HARD_FPS = 32; // one window this bad -> lite immediately
    const SOFT_FPS = 46; // a couple of windows this bad -> lite
    const SOFT_HITS = 2;
    const MONITOR = 18000; // stop watching after this; by now we know

    let raf = 0;
    let frames = 0;
    let windowStart = 0;
    let soft = 0;
    let dirty = false;
    const started = performance.now();

    const tick = (now) => {
      if (document.hidden) dirty = true;
      if (now - started < WARMUP) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!windowStart) {
        windowStart = now;
        frames = 0;
        dirty = false;
        raf = requestAnimationFrame(tick);
        return;
      }
      frames++;
      const elapsed = now - windowStart;
      if (elapsed >= WINDOW) {
        if (!dirty) {
          const fps = frames / (elapsed / 1000);
          if (fps < HARD_FPS) {
            setLite(true);
            return;
          }
          if (fps < SOFT_FPS && ++soft >= SOFT_HITS) {
            setLite(true);
            return;
          }
        }
        windowStart = now;
        frames = 0;
        dirty = false;
      }
      if (now - started < MONITOR) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
