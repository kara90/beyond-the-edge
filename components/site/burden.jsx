import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  Burden: the reframe at the heart of the offer. The buyer is brilliant at
  their craft and allergic to marketing; we take the whole job off their
  plate. Sits directly after Pain, before the three-options comparison.
*/
export default function Burden() {
  return (
    <section
      id="burden"
      className="relative mx-auto max-w-4xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <Reveal>
        <Eyebrow>Why this exists</Eyebrow>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.08] sm:text-5xl">
          You did not spend years mastering your craft to spend your nights
          learning marketing.
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          The best dentists, lawyers, contractors, and doctors we meet are
          brilliant at the work and allergic to the marketing. No time to post.
          No idea what to film. No desire to learn one more tool. So it quietly
          does not happen, and the business that shouts loudest wins the
          customers you deserve. That is the job we take off your plate: the
          website, the videos, the posts, the follow-up, the reviews, the
          bookings. Designed, built, and run for you, for less than a part-time
          hire. You approve. We handle.{" "}
          <span className="text-metallic">You get your evenings back.</span>
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-9">
        <ButtonLink
          href="#plans"
          size="lg"
          data-cta-id="burden-see-plans"
          className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
        >
          See what handled feels like
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
      </Reveal>
    </section>
  );
}
