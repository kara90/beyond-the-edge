import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  PROCESS: a real, ordered sequence, so the numbering carries meaning. Backs
  the risk-reversal promise: you approve the design before anything is built.
*/
const STEPS = [
  {
    title: "Discovery",
    body: "One conversation. We learn your business, your market, and what winning actually looks like, then scope it in plain language.",
  },
  {
    title: "A design you approve",
    body: "You see and sign off on the direction before a single line gets built. If it is not right, we refine it until it is. No surprises, no sunk cost.",
  },
  {
    title: "Build",
    body: "We craft it to flagship standard in weeks, not months, and you can watch the progress the whole way.",
  },
  {
    title: "Launch and grow",
    body: "We ship it live, handle the hosting and the technical side, then keep it sharp with fresh content and steady refinement.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <Eyebrow>How we work</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.08] sm:text-5xl">
          From first email to live in weeks, not months.
        </h2>
      </Reveal>

      <ol className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <li className="h-full border-t border-white/10 pt-6">
              <span className="font-mono text-sm text-edge/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1} className="mt-14 flex flex-col items-center gap-6 text-center">
        <p className="text-muted-foreground">
          You approve the design before anything is built.
        </p>
        <ButtonLink
          href="#contact"
          size="lg"
          data-cta-id="process-start-project"
          className="sheen h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
        >
          Start your project
        </ButtonLink>
      </Reveal>
    </section>
  );
}
