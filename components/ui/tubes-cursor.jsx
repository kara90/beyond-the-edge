"use client";

import { useEffect, useRef } from "react";

/*
  TubesCursor — neon WebGL tubes that follow the mouse, adapted from the
  threejs-components "tubes1" cursor. Mounted INSIDE the hero as an absolute,
  click-through layer with mix-blend-screen, so the neon glows over the hero
  and is clipped to it (the hero stage has overflow-hidden) and scrolls away
  with it. The library sizes its buffer to this layer's parent, so confining it
  to the hero keeps the buffer at viewport size. Desktop + motion only.

  The library is loaded from a CDN at runtime (client only), kept out of the
  static bundle via a non-analyzable dynamic import. Click anywhere recolors it.

  Note: the library defaults its WebGL buffer to the full document height, which
  on a long page becomes a ~70MP buffer. We force the engine to the viewport
  size after init (and on resize) to keep it light (~3MP).
*/
const SRC =
  "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

const randomColors = (count) =>
  new Array(count)
    .fill(0)
    .map(
      () =>
        "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
    );

export default function TubesCursor() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    // Cursor effect: skip on reduced-motion and non-fine pointers (touch).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let disposed = false;
    let onResize = null;

    // Delay so the canvas has real dimensions before the lib reads them.
    const initTimer = setTimeout(() => {
      // Hide the URL from the bundler so it stays a runtime browser import.
      const load = new Function("u", "return import(u)");
      load(SRC)
        .then((module) => {
          if (disposed || !canvasRef.current) return;
          const TubesCursorFx = module.default;
          appRef.current = TubesCursorFx(canvasRef.current, {
            tubes: {
              colors: ["#5e72e4", "#8965e0", "#f5365c"],
              lights: {
                intensity: 200,
                colors: ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"],
              },
            },
          });

          // Constrain the engine to the viewport (it defaults to full page).
          const engine = appRef.current && appRef.current.three;
          if (engine && engine.renderer) {
            const fit = () => {
              const w = window.innerWidth;
              const h = window.innerHeight;
              engine.renderer.setSize(w, h, true);
              if (engine.size) {
                engine.size.width = w;
                engine.size.height = h;
              }
              if (engine.camera && engine.camera.updateProjectionMatrix) {
                engine.camera.aspect = w / h;
                engine.camera.updateProjectionMatrix();
              }
            };
            fit();
            // Re-assert after layout settles, then keep it synced.
            requestAnimationFrame(fit);
            onResize = fit;
            window.addEventListener("resize", fit);
          }
        })
        .catch((err) =>
          console.error("Failed to load TubesCursor module:", err)
        );
    }, 100);

    // Click anywhere randomizes the palette (core behavior of the effect).
    const onClick = () => {
      if (appRef.current) {
        appRef.current.tubes.setColors(randomColors(3));
        appRef.current.tubes.setLightsColors(randomColors(4));
      }
    };
    window.addEventListener("click", onClick);

    return () => {
      disposed = true;
      clearTimeout(initTimer);
      window.removeEventListener("click", onClick);
      if (onResize) window.removeEventListener("resize", onResize);
      if (appRef.current && typeof appRef.current.dispose === "function") {
        appRef.current.dispose();
      }
    };
  }, []);

  return (
    // Fixed, viewport-sized wrapper: the engine sizes the canvas to its parent,
    // so this keeps the WebGL buffer at viewport size (not full-page). The
    // screen blend lives on the wrapper, so the neon composites over the site.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden mix-blend-screen"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
