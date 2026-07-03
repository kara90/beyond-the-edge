"use client";

import { useEffect, useRef } from "react";
import { isLite, onLite } from "@/components/site/perf";

/*
  Background video that pauses when off-screen (so we are not decoding several
  clips at once) but plays reliably the moment it matters.

  Reliability notes: the SSR markup ships preload="none" so first paint costs
  nothing, a generous rootMargin flips it to "auto" ~a screen before the clip
  scrolls into view, a tighter observer starts/stops playback near view, and
  play() is retried on loadeddata/canplay so it still starts even if the first
  play() call landed before the data was ready. Honors reduced-motion (stays
  paused).

  Lite mode: these are decorative clips, and several simultaneous video decodes
  are a big part of the lag on weak devices (some never get a decoder slot, so
  they "don't play at all"). In lite we never load or play the clip, the
  poster still frame shows in its place (no decode, only a small image).
*/
export default function BgVideo({ src, poster, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Show the still poster only: stop fetching/playing the clip entirely.
    const posterOnly = () => {
      try {
        v.pause();
      } catch {}
      v.preload = "none";
      v.removeAttribute("autoplay");
    };
    if (isLite()) {
      posterOnly();
      return;
    }

    let nearView = false;
    const tryPlay = () => {
      if (!nearView) return;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    // If play() was called before the clip had buffered, start it as soon as
    // there is data.
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);

    // Wide observer: start buffering ~a screen early so the clip is ready.
    const preloadIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.preload = "auto"; // upgrade from the SSR preload="none"
            preloadIo.disconnect();
          }
        }
      },
      { rootMargin: "700px 0px" }
    );
    preloadIo.observe(v);

    // Tight observer: only decode/play when the clip is actually near view.
    const playIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          nearView = e.isIntersecting;
          if (nearView) {
            v.preload = "auto";
            tryPlay();
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: "120px 0px" }
    );
    playIo.observe(v);

    let torn = false;
    const cleanup = () => {
      if (torn) return;
      torn = true;
      preloadIo.disconnect();
      playIo.disconnect();
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
    // If the page is janking, stop decoding this clip too (poster stays).
    const unsubLite = onLite(() => {
      cleanup();
      posterOnly();
    });

    return () => {
      cleanup();
      unsubLite();
    };
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className={`bg-video ${className}`}
      {...rest}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
