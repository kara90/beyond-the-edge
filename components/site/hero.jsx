"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Starfield from "@/components/site/starfield";
import ButtonLink from "@/components/site/button-link";

/*
  HERO — the signature moment.

  A tall scroll track drives a pinned stage. As the user scrolls, a rocket
  rises from the planet, accelerates, and pierces a glowing dome at a single
  point. The boundary flares and breaks, and the scene opens into deep space.

  Approach: layered 2D + parallax (DOM + SVG + canvas), all motion mapped
  directly from scroll progress via transform/opacity only, so it stays at
  60fps. The pierce point is locked to horizontal center, so the rocket and
  the dome apex always align across viewport sizes.

  prefers-reduced-motion: a calm, static composition with the dome intact.

  ── SWAP NOTE ─────────────────────────────────────────────────────────────
  The planet and dome are drawn (gradients + SVG) so they scale crisply and
  cost nothing to load. To use real footage instead, drop a <video> into the
  `Stage background` layer and keep the same scroll transforms.
*/

const HEADLINE_OPTIONS = [
  // Primary, used below. Alternates kept here for quick swapping.
  "Most brands stay inside the lines.",
  "Go past the edge of expected.",
  "Built to break the boundary.",
];

export default function Hero() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const p = scrollYProgress;

  // ── Copy ────────────────────────────────────────────────────────────────
  const headlineOpacity = useTransform(p, [0, 0.12, 0.3], [1, 1, 0]);
  const headlineY = useTransform(p, [0, 0.3], [0, -48]);
  const cueOpacity = useTransform(p, [0, 0.07], [1, 0]);

  const beyondOpacity = useTransform(p, [0.62, 0.78, 0.96], [0, 1, 1]);
  const beyondY = useTransform(p, [0.62, 0.9], [36, 0]);

  // ── Scene "camera" push: planet sinks and grows as we pass through ───────
  const sceneScale = useTransform(p, [0.45, 1], [1, 1.55]);
  const sceneYNum = useTransform(p, [0.45, 1], [0, 42]); // vh
  const sceneY = useMotionTemplate`translateY(${sceneYNum}vh)`;

  // ── Starfield reveal + parallax push-in ──────────────────────────────────
  const starOpacity = useTransform(p, [0.28, 0.7], [0.4, 1]);
  const starScale = useTransform(p, [0.28, 1], [1, 1.28]);

  // ── Dome boundary: steady, flares at the pierce, then breaks open ────────
  const domeOpacity = useTransform(
    p,
    [0, 0.45, 0.5, 0.7],
    [0.55, 0.75, 1, 0.12]
  );
  const domeShellOpacity = useTransform(p, [0, 0.5, 0.72], [0.5, 0.6, 0]);
  const breakOpacity = useTransform(p, [0.48, 0.53, 0.85], [0, 1, 1]);

  // ── Pierce burst ──────────────────────────────────────────────────────────
  const burstOpacity = useTransform(p, [0.42, 0.5, 0.66], [0, 1, 0]);
  const burstScale = useTransform(p, [0.44, 0.66], [0.2, 2.6]);
  const ringOpacity = useTransform(p, [0.46, 0.52, 0.72], [0, 0.9, 0]);
  const ringScale = useTransform(p, [0.46, 0.78], [0.1, 3.2]);

  // ── Rocket: rises from the surface, accelerates, exits past the break ────
  const rocketYNum = useTransform(p, [0.12, 0.5, 0.85], [54, 20, -30]); // vh
  const rocketScale = useTransform(p, [0.12, 0.5], [0.82, 1.05]);
  const rocketTransform = useMotionTemplate`translateX(-50%) translateY(${rocketYNum}vh) scale(${rocketScale})`;
  const rocketOpacity = useTransform(
    p,
    [0.08, 0.13, 0.82, 0.93],
    [0, 1, 1, 0]
  );
  const plumeScale = useTransform(p, [0.12, 0.45], [0.5, 1.5]);
  const plumeOpacity = useTransform(p, [0.11, 0.16], [0, 1]);

  // ── Reduced-motion: one calm static frame ────────────────────────────────
  if (reduce) {
    return (
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="absolute inset-0 -z-10 opacity-70">
          <Starfield />
        </div>
        <StaticPlanet />
        <HeroCopy />
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      aria-label="Beyond the Edge Studio"
      className="relative h-[320vh]"
    >
      {/* Pinned stage */}
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* Stage background: deep-space gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(130% 90% at 50% 8%, oklch(0.24 0.04 250) 0%, oklch(0.16 0.022 264) 48%, oklch(0.12 0.02 268) 100%)",
          }}
        />

        {/* Starfield (parallax + reveal) */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ opacity: starOpacity, scale: starScale }}
        >
          <Starfield />
        </motion.div>

        {/* Planet + dome system (the camera pushes through this) */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ scale: sceneScale, transform: sceneY }}
        >
          {/* Planet */}
          <div
            className="absolute left-1/2 rounded-full"
            style={{
              top: "40vh",
              width: "150vh",
              height: "150vh",
              transform: "translateX(-50%)",
              background:
                "radial-gradient(38% 38% at 42% 30%, oklch(0.42 0.06 248) 0%, oklch(0.26 0.05 258) 32%, oklch(0.16 0.03 264) 66%, oklch(0.12 0.02 268) 100%)",
              boxShadow:
                "inset 0 0 120px 30px oklch(0.1 0.02 268 / 0.9), 0 -8px 90px 0 oklch(0.82 0.12 220 / 0.18)",
            }}
          />
          {/* Planet atmosphere rim (cyan limb light along the top) */}
          <div
            className="absolute left-1/2 rounded-full"
            style={{
              top: "40vh",
              width: "150vh",
              height: "150vh",
              transform: "translateX(-50%)",
              background:
                "radial-gradient(50% 50% at 50% 50%, transparent 63%, oklch(0.82 0.12 220 / 0.55) 65.5%, transparent 70%)",
              filter: "blur(2px)",
            }}
          />

          {/* Dome shell — translucent boundary tint */}
          <motion.div
            className="absolute left-1/2 rounded-full"
            style={{
              top: "20vh",
              width: "190vh",
              height: "190vh",
              transform: "translateX(-50%)",
              opacity: domeShellOpacity,
              background:
                "radial-gradient(50% 50% at 50% 50%, transparent 70%, oklch(0.82 0.12 220 / 0.12) 86%, oklch(0.7 0.1 225 / 0.05) 95%, transparent 100%)",
            }}
          />

          {/* Dome boundary line (crisp, glowing) */}
          <motion.svg
            className="absolute left-1/2 top-[20vh]"
            style={{
              width: "190vh",
              height: "190vh",
              transform: "translateX(-50%)",
              opacity: domeOpacity,
              overflow: "visible",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="domeStroke" cx="50%" cy="50%" r="50%">
                <stop offset="68%" stopColor="oklch(0.82 0.12 220)" stopOpacity="0" />
                <stop offset="100%" stopColor="oklch(0.92 0.08 215)" stopOpacity="0.9" />
              </radialGradient>
              <filter id="domeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="url(#domeStroke)"
              strokeWidth="0.5"
              filter="url(#domeGlow)"
            />
          </motion.svg>

          {/* The break: gap + flaring edges at the apex (top-center) */}
          <motion.div
            className="absolute left-1/2 top-[20vh] -translate-x-1/2"
            style={{ opacity: breakOpacity }}
            aria-hidden="true"
          >
            {/* bright cracked edges fanning from the pierce point */}
            <svg
              width="220"
              height="120"
              viewBox="0 0 220 120"
              className="-translate-x-1/2"
              style={{ overflow: "visible" }}
            >
              <g
                stroke="oklch(0.97 0.03 210)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
                style={{ filter: "drop-shadow(0 0 6px oklch(0.85 0.12 220 / 0.9))" }}
              >
                <path d="M110 16 L70 2" />
                <path d="M110 16 L150 2" />
                <path d="M110 16 L88 40" />
                <path d="M110 16 L132 40" />
                <path d="M110 16 L110 -10" />
              </g>
            </svg>
          </motion.div>
        </motion.div>

        {/* Pierce burst + shockwave ring at the apex (fixed to stage, not the
            pushed scene, so the flash stays put as the boundary breaks) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{ top: "20vh" }}
        >
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "60vh",
              height: "60vh",
              opacity: burstOpacity,
              scale: burstScale,
              background:
                "radial-gradient(circle, oklch(0.99 0.02 210 / 0.95) 0%, oklch(0.85 0.12 220 / 0.5) 22%, transparent 60%)",
            }}
          />
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "40vh",
              height: "40vh",
              opacity: ringOpacity,
              scale: ringScale,
              border: "1px solid oklch(0.95 0.05 212 / 0.8)",
              boxShadow: "0 0 30px oklch(0.85 0.12 220 / 0.6)",
            }}
          />
        </motion.div>

        {/* Rocket — travels up the center line */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-0 origin-center"
          style={{ transform: rocketTransform, opacity: rocketOpacity }}
        >
          <Rocket plumeScale={plumeScale} plumeOpacity={plumeOpacity} />
        </motion.div>

        {/* Headline */}
        <motion.div
          className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center"
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <HeroCopy />
        </motion.div>

        {/* "Beyond the edge" reveal after the break */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[34vh] z-10 flex flex-col items-center px-6 text-center"
          style={{ opacity: beyondOpacity, y: beyondY }}
        >
          <p className="eyebrow mb-3 text-edge-bright/80">The boundary is behind you</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Welcome <span className="text-metallic">beyond the edge.</span>
          </h2>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: cueOpacity }}
        >
          <span className="eyebrow block">Scroll</span>
          <span className="mx-auto mt-2 flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-edge" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* Shared hero copy block (used by both the live and reduced-motion hero). */
function HeroCopy() {
  return (
    <>
      <span className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-edge shadow-[0_0_8px_var(--edge)]" />
        Websites · Cinematic video · Growth
      </span>
      <h1 className="font-display text-balance text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
        Most brands stay
        <br className="hidden sm:block" /> inside the lines.
        <span className="mt-3 block text-metallic glow-edge">
          We go beyond the edge.
        </span>
      </h1>
      <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        High-end websites and cinematic video for businesses that refuse to look
        average. Major-brand quality, made accessible.
      </p>
      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <ButtonLink
          href="#contact"
          size="lg"
          className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
        >
          Start your project
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
        <ButtonLink
          href="#work"
          variant="outline"
          size="lg"
          className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-[0.95rem] text-foreground backdrop-blur-sm transition-all duration-300 hover:border-edge/40 hover:bg-white/[0.06]"
        >
          See the work
        </ButtonLink>
      </div>
    </>
  );
}

/* Static planet + intact dome for the reduced-motion experience. */
function StaticPlanet() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute left-1/2 rounded-full"
        style={{
          top: "52vh",
          width: "150vh",
          height: "150vh",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(38% 38% at 42% 30%, oklch(0.42 0.06 248) 0%, oklch(0.26 0.05 258) 32%, oklch(0.16 0.03 264) 66%, oklch(0.12 0.02 268) 100%)",
          boxShadow:
            "inset 0 0 120px 30px oklch(0.1 0.02 268 / 0.9), 0 -8px 90px 0 oklch(0.82 0.12 220 / 0.2)",
        }}
      />
      <div
        className="absolute left-1/2 rounded-full"
        style={{
          top: "32vh",
          width: "190vh",
          height: "190vh",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(50% 50% at 50% 50%, transparent 69%, oklch(0.82 0.12 220 / 0.5) 70.5%, transparent 74%)",
        }}
      />
    </div>
  );
}

/* Sleek, minimal rocket. Champagne body, luminous cyan engine plume. */
function Rocket({ plumeScale, plumeOpacity }) {
  return (
    <div className="relative">
      {/* Engine plume (below the body) */}
      <motion.div
        className="absolute left-1/2 top-[104px] -translate-x-1/2 origin-top"
        style={{ scaleY: plumeScale, opacity: plumeOpacity }}
      >
        <div
          className="h-20 w-3 rounded-b-full"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.97 0.03 210) 0%, oklch(0.82 0.12 220 / 0.9) 35%, oklch(0.7 0.1 225 / 0) 100%)",
            filter: "blur(1.5px)",
          }}
        />
      </motion.div>

      <svg
        width="44"
        height="112"
        viewBox="0 0 44 112"
        fill="none"
        style={{ filter: "drop-shadow(0 0 10px oklch(0.85 0.12 220 / 0.35))" }}
      >
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="44" y2="0">
            <stop offset="0%" stopColor="oklch(0.62 0.05 80)" />
            <stop offset="42%" stopColor="oklch(0.93 0.05 92)" />
            <stop offset="100%" stopColor="oklch(0.7 0.06 72)" />
          </linearGradient>
          <linearGradient id="cone" x1="0" y1="0" x2="44" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.07 70)" />
            <stop offset="100%" stopColor="oklch(0.95 0.05 92)" />
          </linearGradient>
        </defs>
        {/* Fins */}
        <path d="M14 78 L4 100 L14 96 Z" fill="oklch(0.55 0.05 78)" />
        <path d="M30 78 L40 100 L30 96 Z" fill="oklch(0.55 0.05 78)" />
        {/* Fuselage */}
        <path
          d="M22 2 C30 12 33 26 33 44 L33 92 C33 99 28 104 22 104 C16 104 11 99 11 92 L11 44 C11 26 14 12 22 2 Z"
          fill="url(#body)"
        />
        {/* Nose highlight */}
        <path
          d="M22 2 C27 10 30 22 31 36 C26 30 18 30 13 36 C14 22 17 10 22 2 Z"
          fill="url(#cone)"
          opacity="0.9"
        />
        {/* Window */}
        <circle cx="22" cy="50" r="6" fill="oklch(0.18 0.02 264)" />
        <circle cx="22" cy="50" r="6" fill="none" stroke="oklch(0.85 0.12 220)" strokeWidth="1.5" />
        <circle cx="20" cy="48" r="1.6" fill="oklch(0.95 0.05 212)" />
      </svg>
    </div>
  );
}
