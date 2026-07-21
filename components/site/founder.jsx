import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  FOUNDER: the trust multiplier. Puts a face to "direct line to the founder."
  A real on-set photo of the founder operating the camera, framed to match the
  "working director of photography" line beside it. The near-square source sits
  in a square frame so the whole shot reads (boom mic to feet), rather than a
  16:9 slot that would crop it to a band. A founder intro video is a later
  add: the lazy-load scaffold for it lives in founder-video.jsx.
*/
export default function Founder() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="spotlight-edge relative mx-auto aspect-square w-full overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:-translate-y-1.5">
            <img
              src="/media/founder-shooting.jpg"
              alt="Sebastien Ricci operating a cinema camera on set"
              width={800}
              height={778}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* A quiet grounding scrim so the rounded frame reads as intentional. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/35 to-transparent"
            />
            <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-background/45 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-foreground/85 backdrop-blur-sm">
              On set
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>Who you work with</Eyebrow>
          <blockquote className="mt-6 text-2xl font-medium leading-[1.25] tracking-tight sm:text-3xl">
            No account managers, no juniors, no vanishing act. Every project is
            led by the founder, and you work directly with the person
            responsible for the result, start to finish.
          </blockquote>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-foreground/90">
            Behind every project: a working director of photography with 22
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
