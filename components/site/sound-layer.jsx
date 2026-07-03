"use client";

import { useEffect } from "react";
import { isLite, onLite } from "@/components/site/perf";

/*
  SoundLayer: a soft, airy "whoosh" the moment the cursor passes onto a framed
  block (.spotlight-edge: cards, photos, videos, the form). No audio files: a
  short burst of filtered noise that swells and fades, with a band that drifts
  up so it reads as a breath of air rather than a tone. Very low volume, subtle.

  Browser autoplay rules block audio until the user interacts, so the audio
  context is created/resumed on the first gesture. Desktop pointers only,
  debounced so fast moves don't machine-gun, and silent when the tab is hidden.
*/
export default function SoundLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isLite()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    let ctx = null;
    let noise = null; // reusable white-noise buffer
    let lastBlock = null;
    let lastAt = 0;

    const ensure = () => {
      if (!ctx) {
        ctx = new AC();
        const len = Math.floor(ctx.sampleRate * 0.5);
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume();
    };

    const whoosh = () => {
      if (!ctx || ctx.state !== "running" || document.hidden || !noise) return;
      const t = ctx.currentTime;
      const dur = 0.26;

      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.playbackRate.value = 0.9 + Math.random() * 0.25;

      // A broad band that drifts upward = an airy swoosh, not a tone.
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 0.6;
      const f0 = 320 + Math.random() * 160;
      bp.frequency.setValueAtTime(f0, t);
      bp.frequency.exponentialRampToValueAtTime(f0 * 3.2, t + dur);

      // Keep it soft: roll off the harsh highs.
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2600;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.018, t + 0.07); // gentle swell, very quiet
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      src.connect(bp);
      bp.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      src.start(t);
      src.stop(t + dur + 0.02);
    };

    const onOver = (e) => {
      const tgt = e.target;
      const block = tgt && tgt.closest ? tgt.closest(".spotlight-edge") : null;
      if (block && block !== lastBlock) {
        const now = performance.now();
        if (now - lastAt > 110) {
          whoosh();
          lastAt = now;
        }
      }
      lastBlock = block;
    };

    const gesture = () => ensure();
    window.addEventListener("pointerdown", gesture, { passive: true });
    window.addEventListener("wheel", gesture, { passive: true });
    window.addEventListener("keydown", gesture);
    document.addEventListener("pointerover", onOver, { passive: true });

    let torn = false;
    const teardown = () => {
      if (torn) return;
      torn = true;
      window.removeEventListener("pointerdown", gesture);
      window.removeEventListener("wheel", gesture);
      window.removeEventListener("keydown", gesture);
      document.removeEventListener("pointerover", onOver);
      try {
        if (ctx) ctx.close();
      } catch {}
      ctx = null;
    };

    // If the page drops to lite mode later, release the audio context too.
    const unsubLite = onLite(teardown);

    return () => {
      teardown();
      unsubLite();
    };
  }, []);

  return null;
}
