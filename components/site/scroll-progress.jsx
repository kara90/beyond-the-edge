"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/*
  ScrollProgress — a thin luminous line at the very top that fills as you move
  through the page. Sits above the nav. Subtle, edge-colored.
*/
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-edge via-edge-bright to-edge"
    />
  );
}
