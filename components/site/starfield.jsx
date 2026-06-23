"use client";

import { useEffect, useRef } from "react";

/*
  Starfield — a lightweight canvas layer of drifting, twinkling stars that
  react to the mouse: a depth-based parallax (the whole field eases with the
  cursor) plus a soft local repulsion (stars push aside as the cursor passes,
  then settle back). Render-time offsets only, so stars elastically return to
  their drift path. Stays at 60fps; honors prefers-reduced-motion (one static
  frame, no loop, no interaction).
*/
const PARALLAX = 26; // px the field eases with the cursor (scaled by depth)
const REPEL_RADIUS = 120; // px around the cursor that pushes stars
const REPEL_STRENGTH = 30; // px max push at the cursor

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

    // Mouse state: raw client coords + an eased parallax vector (-0.5..0.5).
    let mClientX = -9999;
    let mClientY = -9999;
    let parTargetX = 0;
    let parTargetY = 0;
    let parX = 0;
    let parY = 0;

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
        // Depth drives size, brightness, drift speed and parallax amount.
        z: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.5,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);

      // Ease the parallax toward the target for smooth motion.
      parX += (parTargetX - parX) * 0.06;
      parY += (parTargetY - parY) * 0.06;

      // Map the cursor into the canvas drawing space (handles scale/transform).
      const rect = canvas.getBoundingClientRect();
      const hasMouse = !reduceMotion && mClientX > -9000 && rect.width > 0;
      const mx = hasMouse ? ((mClientX - rect.left) / rect.width) * width : 0;
      const my = hasMouse ? ((mClientY - rect.top) / rect.height) * height : 0;

      for (const s of stars) {
        const size = 0.4 + s.z * 1.6;
        const base = 0.25 + s.z * 0.55;
        const flicker = reduceMotion
          ? 1
          : 0.7 + 0.3 * Math.sin(t * 0.001 * s.speed + s.twinkle);
        const alpha = Math.min(1, base * flicker);

        // Parallax: nearer (higher z) stars shift more with the cursor.
        let ox = parX * (0.3 + s.z) * PARALLAX;
        let oy = parY * (0.3 + s.z) * PARALLAX;

        // Local repulsion: push stars away from the cursor, falling off to 0.
        if (hasMouse) {
          const dx = s.x - mx;
          const dy = s.y - my;
          if (Math.abs(dx) < REPEL_RADIUS && Math.abs(dy) < REPEL_RADIUS) {
            const dist = Math.hypot(dx, dy) || 0.0001;
            if (dist < REPEL_RADIUS) {
              const push = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
              ox += (dx / dist) * push;
              oy += (dy / dist) * push;
            }
          }
        }

        ctx.beginPath();
        ctx.fillStyle =
          s.z > 0.78
            ? `rgba(186, 232, 255, ${alpha})`
            : `rgba(228, 236, 248, ${alpha})`;
        ctx.arc(s.x + ox, s.y + oy, size, 0, Math.PI * 2);
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

    // Mouse interaction (no-ops on touch since there is no mousemove).
    const onMove = (e) => {
      mClientX = e.clientX;
      mClientY = e.clientY;
      parTargetX = e.clientX / window.innerWidth - 0.5;
      parTargetY = e.clientY / window.innerHeight - 0.5;
    };
    const onLeave = () => {
      mClientX = -9999;
      parTargetX = 0;
      parTargetY = 0;
    };
    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
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
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
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
