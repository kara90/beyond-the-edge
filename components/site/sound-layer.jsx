"use client";

import { useEffect } from "react";

/*
  SoundLayer — a soft, synthesized "tick" the moment the cursor passes onto a
  framed block (.spotlight-edge: cards, photos, videos, the form). No audio
  files: a short, low sine blip via Web Audio, with a slightly randomized pitch
  so repeated passes never grate, a gentle attack (no click), and a quick decay.

  Browser autoplay rules block audio until the user interacts, so the audio
  context is created/resumed on the first gesture. Desktop pointers only,
  debounced so fast moves don't machine-gun, and silent when the tab is hidden.
*/
export default function SoundLayer() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    let ctx = null;
    let lastBlock = null;
    let lastAt = 0;

    const ensure = () => {
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
    };

    const blip = () => {
      if (!ctx || ctx.state !== "running" || document.hidden) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2200;

      const f = 540 + Math.random() * 170; // small pitch variation
      osc.type = "sine";
      sub.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 0.72, t + 0.13);
      sub.frequency.setValueAtTime(f / 2, t); // soft body an octave down

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 0.006); // soft attack, low volume
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(lp);
      sub.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      sub.start(t);
      osc.stop(t + 0.17);
      sub.stop(t + 0.17);
    };

    const onOver = (e) => {
      const tgt = e.target;
      const block = tgt && tgt.closest ? tgt.closest(".spotlight-edge") : null;
      if (block && block !== lastBlock) {
        const now = performance.now();
        if (now - lastAt > 80) {
          blip();
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

    return () => {
      window.removeEventListener("pointerdown", gesture);
      window.removeEventListener("wheel", gesture);
      window.removeEventListener("keydown", gesture);
      document.removeEventListener("pointerover", onOver);
      if (ctx) ctx.close();
    };
  }, []);

  return null;
}
