"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isLite, onLite } from "@/components/site/perf";

/*
  SmoothScroll: Lenis momentum scrolling for the whole page. Lenis drives the
  real window scroll, so the scroll-linked hero (framer-motion useScroll) keeps
  working. Disabled for reduced-motion. In-page anchor links are smoothed too.
*/
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // On weak devices the momentum rAF loop is pure overhead: native scroll.
    if (isLite()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smooth same-page anchor navigation
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    let torn = false;
    const teardown = () => {
      if (torn) return;
      torn = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };

    // If lite mode kicks in mid-session, hand scrolling back to the browser.
    const unsubLite = onLite(teardown);

    return () => {
      teardown();
      unsubLite();
    };
  }, []);

  return null;
}
