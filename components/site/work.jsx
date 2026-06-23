import { ArrowUpRight, Play, ImageIcon } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  THE WORK — placeholder grid, ready for real projects.
  Each frame is a labelled media swap point. Replace the gradient block with an
  <img> / <video> and update the title, category and `video` flag.

  ── SWAP NOTE ──────────────────────────────────────────────────────────────
  Drop project media into each frame's media layer. Keep the ratios per item so
  the grid stays balanced.
*/
const PROJECTS = [
  { id: "P-01", label: "Featured film", category: "Cinematic video", ratio: "aspect-[16/10]", wide: true, video: true },
  { id: "P-02", label: "Flagship website", category: "Web", ratio: "aspect-[4/5]" },
  { id: "P-03", label: "Brand campaign", category: "Video · Web", ratio: "aspect-[4/5]", video: true },
  { id: "P-04", label: "Product launch", category: "Web", ratio: "aspect-[16/10]", wide: true },
];

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
            <article className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all duration-500 hover:border-edge/30 hover:shadow-[0_30px_80px_-30px_oklch(0.82_0.12_220/0.3)]">
              {/* MEDIA SWAP POINT — replace this block with <img>/<video> */}
              <div className={`relative ${p.ratio} w-full overflow-hidden`}>
                <div
                  className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 20%, oklch(0.26 0.04 250) 0%, oklch(0.18 0.025 264) 55%, oklch(0.14 0.02 268) 100%)",
                  }}
                />
                {/* faint boundary arc echoing the brand */}
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-56 rounded-full border border-edge/15 transition-colors duration-500 group-hover:border-edge/30"
                />

                {/* light sweep on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_30%,oklch(1_0_0/0.08)_48%,transparent_62%)] transition-transform duration-[1.1s] ease-out group-hover:translate-x-full"
                />

                {p.video && (
                  <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-edge/50">
                    <Play className="size-5 translate-x-px fill-edge text-edge" />
                  </span>
                )}

                <span className="absolute left-5 top-5 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/60">
                  <ImageIcon className="size-3.5" /> Media
                </span>

                {/* hover reveal: View project */}
                <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/55 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    View project
                    <ArrowUpRight className="size-4 text-edge" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h3 className="text-lg font-semibold">{p.label}</h3>
                  <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {p.category}
                  </p>
                </div>
                <ArrowUpRight className="size-5 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-edge" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
