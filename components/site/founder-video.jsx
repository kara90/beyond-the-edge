"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { BrandMark } from "@/components/site/nav";

/*
  FounderVideo: a 16:9 intro-video slot for the founder section.

  TODO(asset): drop the real files in place:
    - /public/media/founder-intro.mp4   (the 45-second founder intro)
    - /public/media/founder-poster.jpg  (a poster frame from that video)

  Behavior: shows the poster with a play button; the <video> element is only
  created after the visitor clicks (true lazy-load, never autoplays). Until
  the poster asset exists, a brand lockup renders in its place so the slot
  never looks broken.
*/
const VIDEO_SRC = "/media/founder-intro.mp4";
const POSTER_SRC = "/media/founder-poster.jpg";

export default function FounderVideo() {
  const [playing, setPlaying] = useState(false);
  const [posterMissing, setPosterMissing] = useState(false);

  return (
    <div className="spotlight-edge relative mx-auto aspect-video w-full overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:-translate-y-1.5">
      {playing ? (
        <video
          src={VIDEO_SRC}
          poster={posterMissing ? undefined : POSTER_SRC}
          controls
          autoPlay
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play the founder introduction video"
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* Poster (or brand lockup until the asset lands) */}
          {posterMissing ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              style={{
                background:
                  "radial-gradient(120% 100% at 30% 20%, oklch(0.28 0.04 250) 0%, oklch(0.18 0.025 264) 60%, oklch(0.13 0.02 268) 100%)",
              }}
            >
              <BrandMark className="size-16" />
              <span className="text-center font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground/70">
                Directed by
                <br />
                Sebastien Ricci
              </span>
            </span>
          ) : (
            <img
              src={POSTER_SRC}
              alt="Sebastien Ricci, founder of Beyond the Edge Studio"
              loading="lazy"
              decoding="async"
              onError={() => setPosterMissing(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {/* Play affordance */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-edge/50 group-hover:shadow-[0_0_30px_-6px_var(--edge)]">
              <Play className="size-6 translate-x-0.5 fill-edge text-edge" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
