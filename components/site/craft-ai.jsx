import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  Real craft, enhanced by AI — positions the studio's method honestly right
  before Pricing: real production is the hero, AI is the advantage that
  explains the speed and the price. No content-mill read.
*/
export default function CraftAi() {
  return (
    <section id="craft" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="flex justify-center">
          <Eyebrow centered>How we do it</Eyebrow>
        </div>
        <h2 className="mt-6 text-3xl font-semibold leading-[1.05] sm:text-5xl">
          Real craft,
          <span className="text-metallic"> enhanced by AI.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          We are a studio, not a content mill. Real cameras, real direction,
          real editing, and funnels built by hand, enhanced by the best of AI.
          The AI makes us faster and keeps your price well below a traditional
          agency. The craft, a real director and DP behind every project, is
          what makes it look expensive and actually convert. That blend is how
          you get major-brand quality for less.
        </p>
      </Reveal>
    </section>
  );
}
