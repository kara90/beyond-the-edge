import { Globe, Clapperboard, LineChart, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

const SERVICES = [
  {
    icon: Globe,
    title: "Websites",
    meta: "Design · Build · Launch",
    body: "A site that makes a local business look national. Fast, cinematic, and built to turn visitors into enquiries and sales.",
  },
  {
    icon: Clapperboard,
    title: "Cinematic video",
    meta: "Brand films · Social",
    body: "Brand films and social cuts shot and crafted with real direction and a real eye, the kind of production big brands pay a premium for, brought to your business. Footage your competitors cannot match.",
  },
  {
    icon: LineChart,
    title: "Ongoing growth",
    meta: "Content · Optimization",
    body: "We do not vanish at launch. A steady flow of fresh content and refinement that keeps you visible and keeps the leads coming.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36"
    >
      <Reveal>
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
          Three ways we take a brand past the edge.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <article className="spotlight-edge group relative h-full overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-8 transition-all duration-500 hover:-top-1.5 hover:border-edge/30 hover:bg-white/[0.04] hover:shadow-[0_24px_70px_-24px_oklch(0.82_0.12_220/0.3)]">
              {/* Accent line that draws across the top on hover */}
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-edge to-transparent transition-transform duration-500 group-hover:scale-x-100" />

              <span className="relative inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-edge transition-all duration-500 group-hover:border-edge/40 group-hover:shadow-[0_0_22px_-4px_var(--edge)]">
                <s.icon className="size-5 transition-transform duration-500 group-hover:scale-110" />
              </span>

              <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                {s.body}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/70">
                  {s.meta}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-edge" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
