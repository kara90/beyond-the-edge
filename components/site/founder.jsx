import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import FounderVideo from "@/components/site/founder-video";

/*
  FOUNDER: the trust multiplier. Puts a face to "direct line to the founder."
  The card is a 16:9 intro-video slot (see founder-video.jsx for the asset
  TODO); it lazy-loads and never autoplays.
*/
export default function Founder() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <FounderVideo />
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>Who you work with</Eyebrow>
          <blockquote className="mt-6 text-2xl font-medium leading-[1.25] tracking-tight sm:text-3xl">
            No account managers, no juniors, no vanishing act. Every project is
            led by the founder, and you work directly with the person
            responsible for the result, start to finish.
          </blockquote>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-foreground/90">
            Behind every project: a working director of photography with 21
            years of commercial credits, including an Absolut Vodka commercial
            and an Amazon Prime series.
          </p>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            That is how the work stays sharp and the standard stays high. When
            you email, the person building your site is the one who replies.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div>
              <p className="font-display text-lg font-semibold">
                Sebastien Ricci
              </p>
              <p className="text-sm text-muted-foreground">
                Founder and Director
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
