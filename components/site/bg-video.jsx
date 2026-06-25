"use client";

import { useEffect, useRef } from "react";

/*
  Background video that pauses when off-screen (so we are not decoding several
  clips at once) but plays reliably the moment it matters.

  Reliability notes: preload="metadata" keeps the initial page load light, a
  generous rootMargin starts the full buffering ~a screen before the clip
  scrolls into view, and play() is retried on loadeddata/canplay so it still
  starts even if the first play() call landed before the data was ready.
  Honors reduced-motion (stays paused).
*/
export default function BgVideo({ src, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let inView = false;
    const tryPlay = () => {
      if (!inView) return;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    // If play() was called before the clip had buffered, start it as soon as
    // there is data.
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting;
          if (inView) {
            v.preload = "auto"; // fully buffer once we are near
            tryPlay();
          } else {
            v.pause();
          }
        }
      },
      // Start buffering/playing ~a screen early so it is ready when visible.
      { rootMargin: "700px 0px" }
    );
    io.observe(v);

    return () => {
      io.disconnect();
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <video ref={ref} muted loop playsInline preload="metadata" className={className} {...rest}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
