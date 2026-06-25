"use client";

import { useEffect } from "react";
import { isLite, setLite } from "@/components/site/perf";

/*
  PerfGuard — measures real frame rate shortly after load and switches the site
  to lite mode if the page is janking, which sheds the heavy GPU effects. Skips
  the probe entirely if coarse hints already flagged the device as lite.
*/
export default function PerfGuard() {
  useEffect(() => {
    if (isLite()) return; // already lite from device hints

    let raf = 0;
    let warmup = 0;
    let frames = 0;
    let measureStart = 0;

    const WARMUP_MS = 800; // skip initial load/hydration jank
    const WINDOW_MS = 1600;
    const MIN_FPS = 38;

    const tick = (now) => {
      if (!warmup) warmup = now;
      if (now - warmup < WARMUP_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!measureStart) {
        measureStart = now;
        frames = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      frames++;
      const elapsed = now - measureStart;
      if (elapsed < WINDOW_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const fps = frames / (elapsed / 1000);
      if (fps < MIN_FPS) setLite(true);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
