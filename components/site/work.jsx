import { ArrowUpRight, Play, Quote } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  THE WORK — proof structure, built to convert. Three layers:
    1) Project cards: media + client type + one-line result
    2) A credits strip (client logos / "as seen")
    3) One testimonial block

  Everything below is a labelled placeholder. Swap the media, fill the result
  lines, drop in real logos, and replace the testimonial. The structure is
  built so that once real pieces land, it reads as strong proof.

  ── SWAP NOTES ──────────────────────────────────────────────────────────────
  - PROJECTS: replace the gradient media layer with <img>/<video>; set
    `clientType` and `result` (the one-line outcome) per project.
  - LOGOS: replace each frame with a real client / press logo.
  - TESTIMONIAL: replace quote, name, business.
*/
const PROJECTS = [
  { id: "P-01", clientType: "Restaurant group", result: "One-line result goes here", ratio: "aspect-[16/10]", wide: true, video: true },
  { id: "P-02", clientType: "Dental clinic", result: "One-line result goes here", ratio: "aspect-[4/5]" },
  { id: "P-03", clientType: "Real estate", result: "One-line result goes here", ratio: "aspect-[4/5]", video: true },
  { id: "P-04", clientType: "Home services", result: "One-line result goes here", ratio: "aspect-[16/10]", wide: true },
];

const LOGOS = ["Logo", "Logo", "Logo", "Logo", "Logo"];

const TESTIMONIAL = {
  quote:
    "Client testimonial goes here. One or two sentences on the result we delivered, in their own words.",
  name: "Client name",
  business: "Business, industry",
};

export default function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Selected work</Eyebrow>
          <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
            Proof, not promises.
          </h2>
        </div>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
          Selected work. More added as new projects ship.
        </p>
      </Reveal>

      {/* 1) Project cards */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal
            key={p.id}
            delay={i * 0.06}
            className={p.wide ? "sm:col-span-2" : ""}
          >
            <article className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all duration-500 hover:-translate-y-1.5 hover:border-edge/30 hover:shadow-[0_30px_80px_-30px_oklch(0.82_0.12_220/0.3)]">
              {/* MEDIA SWAP POINT — replace with <img>/<video> */}
              <div className={`relative ${p.ratio} w-full overflow-hidden`}>
                <div
                  className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 20%, oklch(0.26 0.04 250) 0%, oklch(0.18 0.025 264) 55%, oklch(0.14 0.02 268) 100%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-56 rounded-full border border-edge/15 transition-colors duration-500 group-hover:border-edge/30"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_30%,oklch(1_0_0/0.08)_48%,transparent_62%)] transition-transform duration-[1.1s] ease-out group-hover:translate-x-full"
                />
                {/* Composed placeholder — reads intentional until real media lands */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  {p.video && (
                    <span className="flex size-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-edge/40">
                      <Play className="size-5 translate-x-px fill-edge/80 text-edge/80" />
                    </span>
                  )}
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground/55">
                    Project coming soon
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/55 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    View project
                    <ArrowUpRight className="size-4 text-edge" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-edge/70">
                    {p.clientType}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-foreground/90">
                    {p.result}
                  </h3>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-edge" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* 2) Credits strip */}
      <Reveal delay={0.05} className="mt-20">
        <p className="text-center font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground/60">
          Trusted by brands that refuse to blend in
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {LOGOS.map((l, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/40"
            >
              {/* LOGO SWAP POINT */}
              {l}
            </div>
          ))}
        </div>
      </Reveal>

      {/* 3) Testimonial */}
      <Reveal delay={0.1} className="mt-12">
        <figure className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-10 sm:p-14">
          <Quote
            aria-hidden="true"
            className="absolute right-8 top-8 size-16 text-edge/10"
          />
          <blockquote className="relative max-w-3xl text-balance text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl">
            {TESTIMONIAL.quote}
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            {/* avatar / logo placeholder */}
            <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/50">
              IMG
            </span>
            <div>
              <p className="text-sm font-semibold">{TESTIMONIAL.name}</p>
              <p className="text-sm text-muted-foreground">
                {TESTIMONIAL.business}
              </p>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
