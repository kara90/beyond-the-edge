import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  Real craft, enhanced by AI: positions the studio's method honestly right
  before Pricing: real production is the hero, AI is the advantage that
  explains the speed and the price. No content-mill read.
*/
const BEATS = [
  "Real cameras, real direction, real editing. A studio, not a content mill.",
  "AI accelerates the slow, expensive production work. It is never the author.",
  "A build that takes an agency four months and $15,000 takes us weeks, at a fraction.",
];

export default function CraftAi() {
  return (
    <section id="craft" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="flex justify-center">
          <Eyebrow centered>How we do it</Eyebrow>
        </div>
        <h2 className="mt-6 text-3xl font-semibold leading-[1.08] sm:text-5xl">
          Real craft,
          <span className="text-metallic"> enhanced by AI.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Here is why our quotes look nothing like agency quotes.
        </p>
        <ul className="mx-auto mt-8 max-w-md border-y border-white/8 text-left divide-y divide-white/8">
          {BEATS.map((b) => (
            <li key={b} className="flex items-start gap-3 py-4">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-edge shadow-[0_0_8px_var(--edge)]"
              />
              <p className="text-[0.95rem] leading-relaxed text-foreground/90">
                {b}
              </p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          The craft, a real director and DP behind every project, is what makes
          it look expensive and actually convert.
        </p>
      </Reveal>
    </section>
  );
}
