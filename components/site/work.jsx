import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  THE WORK: honest proof, no fakes. Two layers:
    1) Exhibit A: the site itself is the flagship proof piece.
    2) Concept builds: real techniques shown as clearly-labelled concepts.

  When client projects ship, add them here as cards with real media and a
  one-line result. Never ship placeholder logos or testimonials.
*/
const CONCEPTS = [
  {
    id: "C-01",
    label: "Concept build",
    clientType: "Dental clinic",
    result:
      "A scroll-driven 3D hero that makes a local clinic feel like a national brand",
  },
  {
    id: "C-02",
    label: "Concept build",
    clientType: "Creative studio",
    result:
      "A cinematic one-pager with a live on-site checkout, the same system as this site",
  },
];

export default function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Selected work</Eyebrow>
          <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-[1.08] sm:text-5xl">
            Proof, not promises.
          </h2>
        </div>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
          The strongest proof is the page you are on. Concept builds below,
          client work added as projects ship.
        </p>
      </Reveal>

      {/* 1) Exhibit A: the site itself */}
      <Reveal className="mt-16">
        <div className="spotlight-edge glass-clear rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-edge/70">
                Exhibit A
              </p>
              <h3 className="mt-4 max-w-lg text-2xl font-semibold leading-snug sm:text-3xl">
                You are scrolling the proof right now.
              </h3>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
                This site is our own build: the cinematic scroll opening, the
                liquid motion, the live checkout. Every technique on this page
                is available to your brand. If it made you pause, imagine it
                working on your customers.
              </p>
            </div>
            <ButtonLink
              href="#pricing"
              size="lg"
              className="sheen h-12 shrink-0 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
            >
              Get this level of work
            </ButtonLink>
          </div>
        </div>
      </Reveal>

      {/* 2) Concept builds */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {CONCEPTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <article className="spotlight-edge group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all duration-500 hover:-translate-y-1.5 hover:border-edge/30 hover:shadow-[0_30px_80px_-30px_oklch(0.82_0.12_220/0.3)]">
              {/* MEDIA SWAP POINT: replace with <img>/<video> when the concept
                  gets a real walkthrough */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 20%, oklch(0.26 0.04 250) 0%, oklch(0.18 0.025 264) 55%, oklch(0.14 0.02 268) 100%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-56 rounded-full border border-edge/15 transition-colors duration-500 group-hover:border-edge/30"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_30%,oklch(1_0_0/0.08)_48%,transparent_62%)] transition-transform duration-[1.1s] ease-out group-hover:translate-x-full"
                />
                {/* Type lockup: intentional, not a fake screenshot */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-edge/60">
                    {p.label}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-[0.22em] text-foreground/80">
                    {p.clientType}
                  </span>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-edge/70">
                  {p.clientType}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-foreground/90">
                  {p.result}
                </h3>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
