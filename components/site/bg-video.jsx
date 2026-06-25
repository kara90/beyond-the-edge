"use client";

import { useEffect, useRef } from "react";

/*
  Background video that only loads and plays while it is on (or near) the
  screen, and pauses when scrolled away. Replaces plain autoPlay videos so we
  are not decoding several clips at once off-screen. preload="none" + play()
  on first intersection also defers the download until it is actually needed,
  which lightens the initial page load. Honors reduced-motion (stays paused).
*/
export default function BgVideo({ src, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} muted loop playsInline preload="none" className={className} {...rest}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
