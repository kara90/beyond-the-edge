import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  Pain — names the problem and agitates it calmly, then turns to the solution.
  Sits directly after the hero. Empathetic, premium, never infomercial.
*/
const PAINS = [
  "You run a business, not a design studio. Doing this yourself costs nights and weekends you do not have.",
  "Templates all look the same, and customers can tell. Making something look genuinely high-end is its own craft.",
  "You do not have the camera, the editing suite, the designer, and the marketing team that big brands rely on.",
  "So it sits on the to-do list. And while it waits, customers quietly choose the competitor who looks more established.",
];

export default function Pain() {
  return (
    <section id="pain" className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
      <Reveal>
        <Eyebrow>Why great businesses still look average online</Eyebrow>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.12] sm:text-4xl">
          You know it should look better.
          <span className="text-muted-foreground">
            {" "}
            You just do not have the time, the tools, or the team to make it
            happen.
          </span>
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mt-12">
        <ul className="spotlight-edge divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
          {PAINS.map((p) => (
            <li key={p} className="flex items-start gap-4 p-6 sm:px-8">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-edge shadow-[0_0_8px_var(--edge)]"
              />
              <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
                {p}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="spotlight-edge rounded-2xl border border-edge/20 bg-edge/[0.04] p-8 sm:p-10">
          <p className="text-lg leading-relaxed text-foreground sm:text-xl">
            That is exactly what we take off your plate. You hand it over, we
            handle all of it, the design, the film, the funnel, the launch, and
            you get a brand that
            <span className="text-metallic"> looks like the leader</span>,
            without lifting a finger or learning a thing.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
