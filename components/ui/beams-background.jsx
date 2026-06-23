"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/*
  BeamsBackground — animated, blurred diagonal light beams on a transparent
  canvas, adapted from the beams-background component to act as an ambient layer
  INSIDE the hero (not the original full-screen demo with its own text/overlay).

  Adaptations: canvas only (the demo's motion blur overlay would have blurred the
  hero content, so it is dropped); sized to its own element so it scopes to the
  hero; hues tuned to space-blue; reduced-motion paints one static frame.
*/
const OPACITY = { subtle: 0.6, medium: 0.78, strong: 1 };

function createBeam(width, height) {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 205 + Math.random() * 40, // space blue
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({ className, intensity = "medium" }) {
  const canvasRef = useRef(null);
  const beamsRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const MINIMUM_BEAMS = 20;
    let cssW = 0;
    let cssH = 0;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      if (cssW === 0 || cssH === 0) return;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const total = Math.floor(MINIMUM_BEAMS * 1.5);
      beamsRef.current = Array.from({ length: total }, () =>
        createBeam(cssW, cssH)
      );
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const resetBeam = (beam, index, total) => {
      const column = index % 3;
      const spacing = cssW / 3;
      beam.y = cssH + 100;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 205 + (index * 40) / total;
      beam.opacity = 0.2 + Math.random() * 0.1;
    };

    const drawBeam = (beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const o =
        beam.opacity *
        (0.8 + Math.sin(beam.pulse) * 0.2) *
        (OPACITY[intensity] || OPACITY.medium);
      const g = ctx.createLinearGradient(0, 0, 0, beam.length);
      g.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
      g.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${o * 0.5})`);
      g.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${o})`);
      g.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${o})`);
      g.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${o * 0.5})`);
      g.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.filter = "blur(32px)";
      const total = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        if (!reduce) {
          beam.y -= beam.speed;
          beam.pulse += beam.pulseSpeed;
        }
        if (beam.y + beam.length < -100) resetBeam(beam, index, total);
        drawBeam(beam);
      });
      if (!reduce) rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  );
}
