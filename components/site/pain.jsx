import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  Pain — names the problem and agitates it calmly, then turns to the solution.
  Sits directly after the hero. Empathetic, premium, never infomercial.
*/
const PAINS = [
  "You lost a weekend to a DIY builder and it still screams template. Customers judge you in about three seconds, and the jobs you lose to that first impression never even call to tell you.",
  "The agencies that could fix it quote $15,000 to $50,000 and four months of meetings. That is a car, gone, before a single new customer walks in.",
  "The cheap freelancer felt like the smart move, until the replies slowed, then stopped. Now you own a half-finished site and a login you were never given.",
  "So it sits on the to-do list. If a customer is worth $500 to you, losing just two a week to a better-looking competitor is over $50,000 a year, every year it waits.",
];

export default function Pain() {
  return (
    <section id="pain" className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
      <Reveal>
        <Eyebrow>What a cheap-looking site really costs</Eyebrow>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.08] sm:text-5xl">
          A cheap-looking site does not just embarrass you.
          <span className="text-muted-foreground">
            {" "}
            It quietly hands your best customers to whichever competitor looks
            more established.
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
            That is the gap we close. One studio, one direct line, no handoffs.
            We design, film, build, and launch it all, in weeks instead of
            months, at a fraction of the agency quote, and you get a brand that
            <span className="text-metallic"> looks like the leader</span>
            {" "}without lifting a finger or learning a single tool.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href="#contact"
              size="lg"
              className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
            >
              Start your project
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink
              href="#pricing"
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-[0.95rem] text-foreground backdrop-blur-sm transition-all duration-300 hover:border-edge/40 hover:bg-white/[0.06]"
            >
              See pricing
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
