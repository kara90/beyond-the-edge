import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/site/reveal";

/*
  THE WORK — placeholder grid, ready for real projects.
  Each frame is a labelled media swap point. Replace the gradient block
  with an <img> / <video> and update the title, category and meta.

  ── SWAP NOTE ──────────────────────────────────────────────────────────────
  Drop project media into each frame's `media` slot. Keep the 4:3 / 16:9
  ratios per item so the grid stays balanced.
*/
const PROJECTS = [
  { id: "P-01", label: "Featured film", category: "Cinematic video", ratio: "aspect-[16/10]", wide: true },
  { id: "P-02", label: "Website", category: "Web", ratio: "aspect-[4/5]" },
  { id: "P-03", label: "Brand campaign", category: "Video · Web", ratio: "aspect-[4/5]" },
  { id: "P-04", label: "Product launch", category: "Web", ratio: "aspect-[16/10]", wide: true },
];

export default function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">02 / The work</p>
          <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Proof, not promises.
          </h2>
        </div>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
          A selection of recent work lands here. Each piece built to make a
          business look like the leader in its market.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal
            key={p.id}
            delay={i * 0.06}
            className={p.wide ? "sm:col-span-2" : ""}
          >
            <article className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
              {/* MEDIA SWAP POINT — replace this block with <img>/<video> */}
              <div
                className={`relative ${p.ratio} w-full overflow-hidden`}
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 20%, oklch(0.26 0.04 250) 0%, oklch(0.18 0.025 264) 55%, oklch(0.14 0.02 268) 100%)",
                }}
              >
                {/* faint boundary arc echoing the brand */}
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-56 rounded-full border border-edge/15"
                />
                <span className="absolute left-5 top-5 font-mono text-xs tracking-widest text-muted-foreground/70">
                  {p.id}
                </span>
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                  Media
                </span>
                <div className="absolute inset-0 bg-edge/0 transition-colors duration-300 group-hover:bg-edge/[0.04]" />
              </div>

              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {p.label}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {p.category}
                  </p>
                </div>
                <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-edge" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
