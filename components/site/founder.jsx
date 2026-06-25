import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  FOUNDER — the trust multiplier. Puts a face to "direct line to the founder."
  Swap the portrait frame, the name/role, and the signature for the real ones.
*/
export default function Founder() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {/* PORTRAIT SWAP POINT — drop a real founder photo here */}
        <Reveal>
          <div className="spotlight-edge relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:-top-1.5">
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
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/40">
              Portrait
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>Who you work with</Eyebrow>
          <blockquote className="mt-6 text-2xl font-medium leading-[1.25] tracking-tight sm:text-3xl">
            Every project is led by the founder, not handed to a junior. You work
            directly with the person responsible for the result, start to finish.
          </blockquote>
          <p className="mt-7 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            That is how the work stays sharp and the standard stays high. When you
            reach out, you reach the person building it.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div>
              {/* NAME / ROLE SWAP POINT */}
              <p className="font-display text-lg font-semibold">Founder name</p>
              <p className="text-sm text-muted-foreground">
                Founder, Beyond the Edge
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
