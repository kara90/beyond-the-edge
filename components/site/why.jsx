import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import Rock, { ROCK_SRCS } from "@/components/site/rock";
import ScrubVideo from "@/components/site/scrub-video";
import BeamsLayer from "@/components/site/beams-layer";

const POINTS = [
  {
    k: "The line",
    title: "Average is a choice.",
    body: "Most brands settle for the template, the stock look, the safe edit. It blends in. It gets scrolled past. It quietly costs them the customers they should be winning.",
  },
  {
    k: "The edge",
    title: "We cross it on purpose.",
    body: "We treat a local business like a brand worth filming. The craft, the polish, the detail of a major name, applied where it is least expected and felt the most.",
  },
  {
    k: "The result",
    title: "You look like the leader.",
    body: "When the website moves like a film and the film sells like a campaign, the perception shifts. You stop competing on price and start setting the standard.",
  },
];

export default function Why() {
  return (
    <section id="why" className="relative overflow-hidden py-28 sm:py-36">
      {/* Background video — full-bleed and large, scroll-scrubbed (does not
          autoplay), grained, with feathered edges so it blends with no box. */}
      <ScrubVideo
        src="https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b962d967e20d627da48ed.mp4"
        className="hf-liquid media-feather-xy pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        videoClassName="h-full w-full object-cover opacity-[0.2] motion-reduce:hidden"
        grain
      />
      {/* Ambient light-beam aura above the video */}
      <BeamsLayer className="-z-10" opacity={0.5} />

      {/* Quiet boundary motif — smaller and soft-edged (no hard ring line) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[62vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, transparent 38%, oklch(0.82 0.12 220 / 0.05) 56%, transparent 82%)",
          filter: "blur(14px)",
        }}
      />

      {/* Floating rocks in the dark gutters (desktop) */}
      <Rock src={ROCK_SRCS[0]} size={158} className="hidden lg:block left-[4%] top-[20%]" />
      <Rock src={ROCK_SRCS[1]} size={104} className="hidden lg:block right-[5%] bottom-[16%]" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow>The difference</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
            There is a line most brands never cross.
            <span className="text-metallic"> We live on the other side of it.</span>
          </h2>
        </Reveal>

        <div className="spotlight-edge mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.1}>
              <div className="group h-full bg-background/60 p-8 transition-colors duration-500 hover:bg-background/30">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-edge/80">
                  {String(i + 1).padStart(2, "0")} &middot; {p.k}
                </p>
                <h3 className="mt-5 text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
