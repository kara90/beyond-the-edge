import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  PROCESS — a real, ordered sequence, so the numbering carries meaning. Backs
  the risk-reversal promise: you approve the design before anything is built.
*/
const STEPS = [
  {
    title: "Discovery",
    body: "We learn your business, your market, and what winning actually looks like for you.",
  },
  {
    title: "A design you approve",
    body: "You see and sign off on the direction before a single line gets built. No surprises.",
  },
  {
    title: "Build",
    body: "We craft it to flagship standard, fast, and keep you in the loop the whole way.",
  },
  {
    title: "Launch and grow",
    body: "We ship it live, then keep it sharp with fresh content and steady refinement.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <Eyebrow>How we work</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
          A clear path to a brand that performs.
        </h2>
      </Reveal>

      <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <li className="spotlight-edge group relative h-full rounded-2xl border border-white/8 bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-edge/25">
              {/* connecting line to the next step (desktop) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-12 hidden h-px w-5 translate-x-full bg-white/10 lg:block"
                />
              )}
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
    </section>
  );
}
