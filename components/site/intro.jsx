"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/site/nav";

/*
  Intro: a brief cinematic load sequence. The void resolves, a glow blooms, the
  mark rises into an orbiting ring (the logo is a rocket, so it lifts rather
  than just fades), the name and its edge line resolve under it, then the
  curtain pulls up to the hero. Roughly 1.7s, then it unmounts. Skipped
  entirely for reduced-motion. No storage, so it plays each load (kept short).
*/
const EASE_OUT = [0.22, 1, 0.36, 1];

export default function Intro() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, []);

  // The intro belongs to the homepage only; checkout/terms/privacy load clean.
  if (pathname !== "/") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* The void resolving: a glow blooms out behind the mark. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--edge) 26%, transparent), transparent 65%)",
            }}
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: [0, 0.9, 0.6], scale: [0.55, 1.12, 1] }}
            transition={{ duration: 1.5, ease: "easeOut", times: [0, 0.55, 1] }}
          />

          <div className="relative flex flex-col items-center gap-7">
            {/* Mark inside its orbit */}
            <div className="relative grid size-[164px] place-items-center">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-edge/15 border-t-edge"
                initial={{ opacity: 0, scale: 0.78 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.7, ease: EASE_OUT },
                  rotate: { duration: 2.4, ease: "linear", repeat: Infinity },
                }}
              />
              {/* The rocket lifts in, then keeps a slow float while it holds. */}
              <motion.div
                initial={{ opacity: 0, scale: 0.72, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: [18, 0, -5, 0] }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.8, ease: EASE_OUT },
                  y: { duration: 1.7, ease: EASE_OUT, times: [0, 0.45, 0.75, 1] },
                }}
                style={{ filter: "drop-shadow(0 12px 30px color-mix(in oklab, var(--edge) 40%, transparent))" }}
              >
                <BrandMark className="size-28" />
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <motion.span
                className="font-display text-2xl font-semibold tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.55, ease: EASE_OUT }}
              >
                Beyond the <span className="text-metallic">Edge</span>
              </motion.span>
              {/* The edge itself, drawing out under the name. */}
              <motion.span
                aria-hidden="true"
                className="h-px bg-gradient-to-r from-transparent via-edge to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 190, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8, ease: EASE_OUT }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
