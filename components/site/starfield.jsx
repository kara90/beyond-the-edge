"use client";

import { useEffect, useRef } from "react";

/*
  Starfield — a lightweight canvas layer of drifting, twinkling stars.
  Pure transform/opacity work on the GPU side; the canvas itself only
  redraws points, so it stays comfortably at 60fps. Parallax and reveal
  are handled by the parent (transforming this layer's wrapper), keeping
  this component focused on the points themselves.

  Honors prefers-reduced-motion: paints a single static frame, no loop.
*/
export default function Starfield({ density = 0.00018, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let stars = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(width * height * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        // Depth drives size, brightness and drift speed for parallax feel.
        z: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.5,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const size = 0.4 + s.z * 1.6;
        const base = 0.25 + s.z * 0.55;
        const flicker = reduceMotion
          ? 1
          : 0.7 + 0.3 * Math.sin(t * 0.001 * s.speed + s.twinkle);
        const alpha = Math.min(1, base * flicker);

        // Cool white with a faint cyan bias on the brighter stars.
        ctx.beginPath();
        ctx.fillStyle =
          s.z > 0.78
            ? `rgba(186, 232, 255, ${alpha})`
            : `rgba(228, 236, 248, ${alpha})`;
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (!reduceMotion) {
          // Gentle downward drift; wrap to the top to loop seamlessly.
          s.y += s.speed * 0.12 * (0.4 + s.z);
          if (s.y > height + 2) {
            s.y = -2;
            s.x = Math.random() * width;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    seed();
    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(seed, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
