import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import { BrandMark } from "@/components/site/nav";

/*
  FOUNDER: the trust multiplier. Puts a face to "direct line to the founder."
*/
export default function Founder() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Brand lockup frame. A real founder portrait can replace this whole
            block: keep the frame, swap the inner content for an <img>. */}
        <Reveal>
          <div className="spotlight-edge relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:-translate-y-1.5">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 30% 20%, oklch(0.28 0.04 250) 0%, oklch(0.18 0.025 264) 60%, oklch(0.13 0.02 268) 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute -left-12 -top-12 size-48 rounded-full border border-edge/15"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <BrandMark className="size-16" />
              <p className="text-center font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground/70">
                Directed by
                <br />
                Sebastien Ricci
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>Who you work with</Eyebrow>
          <blockquote className="mt-6 text-2xl font-medium leading-[1.25] tracking-tight sm:text-3xl">
            No account managers, no juniors, no vanishing act. Every project is
            led by the founder, and you work directly with the person
            responsible for the result, start to finish.
          </blockquote>
          <p className="mt-7 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
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
