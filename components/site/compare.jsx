import { Check, Minus } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  Compare — the three honest routes out of a bad website, side by side.
  Sits right after Pain so the reader sees the escape hatch before the
  proof sections. Reuses the pricing card language: glass-clear cards,
  glass-featured-clear + badge for the recommended pick.
*/
const OPTIONS = [
  {
    name: "Do it yourself",
    items: [
      "Free to $50 a month",
      "Nights and weekends, gone",
      "Still looks generic",
      "Every update is on you",
    ],
    featured: false,
  },
  {
    name: "Traditional agency",
    items: [
      "$15,000 to $50,000",
      "Three to six months",
      "Account managers between you and the work",
      "Premium result, premium invoice",
    ],
    featured: false,
  },
  {
    name: "Beyond the Edge",
    items: [
      "From $2,497 flat",
      "Live in two to four weeks",
      "Founder-led, one direct line",
      "You approve the design before we build",
    ],
    featured: true,
  },
];

export default function Compare() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <Reveal>
        <Eyebrow>Your three options</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.08] sm:text-5xl">
          Three ways to fix it. Only one is built for you.
        </h2>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3">
        {OPTIONS.map((o, i) => (
          <Reveal key={o.name} delay={i * 0.08} className="h-full">
            <article
              className={`spotlight-edge relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 ${
                o.featured ? "glass-featured-clear" : "glass-clear"
              }`}
            >
              {o.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-primary-foreground">
                  The escape
                </span>
              )}

              <h3 className="font-display text-xl font-semibold tracking-tight">
                {o.name}
              </h3>

              <ul className="mt-6 flex-1 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                {o.items.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-3 py-3 text-sm ${
                      o.featured ? "text-foreground/90" : "text-muted-foreground"
                    }`}
                  >
                    {o.featured ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-edge" />
                    ) : (
                      <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>

              {o.featured && (
                <ButtonLink
                  href="#pricing"
                  data-cta-id="compare-see-pricing"
                  className="mt-7 h-10 self-start rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/85"
                >
                  See pricing
                </ButtonLink>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
