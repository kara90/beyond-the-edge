import { Globe, Clapperboard, LineChart } from "lucide-react";
import Reveal from "@/components/site/reveal";

const SERVICES = [
  {
    icon: Globe,
    title: "Websites",
    body: "Sites that feel like a flagship. Fast, cinematic, and built to convert. The kind of first impression that makes a local business look national.",
  },
  {
    icon: Clapperboard,
    title: "Cinematic video",
    body: "Brand films, product pieces, and social cutdowns shot and cut to feel like a campaign. Footage that earns attention and holds it.",
  },
  {
    icon: LineChart,
    title: "Ongoing growth",
    body: "We do not disappear at launch. A steady cadence of content and refinement that keeps the brand sharp and the pipeline moving.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36"
    >
      <Reveal>
        <p className="eyebrow">01 / What we do</p>
        <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Three ways we take a brand past the edge.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <article className="group h-full rounded-2xl border border-white/8 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-edge/30 hover:bg-white/[0.04]">
              <span className="inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-edge transition-colors duration-300 group-hover:border-edge/40">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
