import { Check, ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  PRICING
  Three one-time build tiers (Orbit recommended + emphasized), then two
  supporting blocks beneath: a la carte Add-ons and monthly care Plans.
  Every feature list uses a thin divider between rows so it scans cleanly.
  All CTAs route to #contact. No new styles: reuses the site tokens.
*/

const tiers = [
  {
    name: "Liftoff",
    tag: "The essential",
    price: "$1,800",
    cadence: "one-time",
    note: "A clean, professional presence done right.",
    features: [
      "Custom designed website, up to 5 pages",
      "Mobile responsive, fast, and secure",
      "Lead capture and contact form",
      "Search and analytics setup",
      "Hosting set up and managed by us",
    ],
    cta: "Start your project",
    featured: false,
  },
  {
    name: "Orbit",
    tag: "The standout",
    price: "$3,500",
    cadence: "one-time",
    note: "Custom design with motion that sets you apart.",
    features: [
      "Custom design, up to 12 pages",
      "Advanced animations and scroll effects",
      "A conversion funnel built into the site",
      "A set of professionally produced images",
      "One short branded hero video",
      "Search and analytics setup",
    ],
    cta: "Start your project",
    featured: true,
  },
  {
    name: "Beyond",
    tag: "The flagship",
    price: "From $7,500",
    cadence: "one-time",
    note: "Final price scales with scope and complexity.",
    features: [
      "Everything in Orbit, fully bespoke",
      "Flagship design: advanced 3D and custom animation",
      "The look of a $20,000 plus experience",
      "Cinematic hero video",
      "Complete conversion and lead system",
      "Priority build and direct creative direction",
    ],
    cta: "Start your project",
    featured: false,
  },
];

// The ceiling. Rendered as a wide band below the three cards so four options
// never crowd the row. Styled the most luxuriously of all (gradient border,
// champagne checks, deeper glow).
const apex = {
  name: "Apex",
  tag: "The sky is the offer",
  price: "From $15,000",
  cadence: "one-time",
  note: "For brands that want the best that can be built. Open-ended by design.",
  features: [
    "Everything in Beyond, with nothing held back",
    "The full signature behind-the-edge experience, a custom animated world built around your brand",
    "Bespoke 3D, motion, and a cinematic scroll journey unique to you",
    "A full cinematic brand film, not just a hero clip",
    "Complete conversion and growth system",
    "Direct line to the founder and white-glove delivery",
  ],
  cta: "Request the flagship",
};

const addons = [
  { item: "Extra page", price: "$150 to $250 each" },
  { item: "Produced brand video", price: "from $1,500" },
  { item: "Advanced 3D or custom animation module", price: "from $800" },
  { item: "Professional copywriting", price: "from $150 per page" },
  { item: "Logo and brand identity", price: "from $750" },
  { item: "Online store or booking setup", price: "from $600" },
  { item: "Rush delivery", price: "plus 25 percent" },
];

const plans = [
  {
    name: "Care",
    price: "$300",
    cadence: "per month",
    features: [
      "Hosting, security, SSL, and backups",
      "Up to 4 small updates a month",
      "One content or photo swap a month",
    ],
  },
  {
    name: "Presence",
    price: "$600",
    cadence: "per month",
    features: [
      "Everything in Care",
      "One produced video a month",
      "One content update and light optimization",
    ],
  },
  {
    name: "Growth",
    price: "From $1,800",
    cadence: "per month",
    features: [
      "Everything in Presence",
      "Ongoing content and campaign management",
      "Ads creative and performance optimization",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal className="text-center">
        <div className="flex justify-center">
          <Eyebrow centered>Pricing</Eyebrow>
        </div>
        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
          Built to go beyond the ordinary.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
          Every project is custom designed and built for your brand. Choose
          where you want to start.
        </p>
      </Reveal>

      {/* Three one-time build tiers */}
      <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="h-full">
            <article
              className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-500 ${
                t.featured
                  ? "sheen border-edge/40 bg-edge/[0.05] shadow-[0_0_70px_-18px_var(--edge)] lg:-my-3 lg:py-11"
                  : "border-white/8 bg-white/[0.02] hover:-translate-y-1.5 hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-primary-foreground">
                  Recommended
                </span>
              )}

              <h3 className="font-display text-xl font-semibold tracking-tight">
                {t.name}
              </h3>
              <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-edge/70">
                {t.tag}
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-2">
                <span className="font-display text-3xl font-semibold tracking-tight text-metallic">
                  {t.price}
                </span>
                <span className="text-sm text-muted-foreground">{t.cadence}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.note}
              </p>

              <ul className="mt-7 flex-1 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 py-3 text-sm text-foreground/90"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-edge" />
                    {f}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="#contact"
                size="lg"
                variant={t.featured ? "default" : "outline"}
                className={`mt-8 h-11 rounded-full font-semibold ${
                  t.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/85"
                    : "border-white/15 bg-white/[0.02] text-foreground hover:bg-white/[0.06]"
                }`}
              >
                {t.cta}
              </ButtonLink>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Apex — the ceiling, as a wide flagship band */}
      <Reveal delay={0.12}>
        <div className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/45 via-edge/25 to-primary/45 p-px shadow-[0_0_110px_-35px_var(--primary)]">
          <article className="sheen relative overflow-hidden rounded-[calc(var(--radius)*1.8-1px)] bg-[oklch(0.17_0.022_264)] p-8 sm:p-10">
            {/* luxe corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.85 0.07 80 / 0.18) 0%, transparent 70%)",
              }}
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              {/* Left: identity + price + CTA */}
              <div className="lg:w-[38%]">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary">
                  <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  The ceiling
                </span>
                <h3 className="mt-5 text-3xl font-semibold sm:text-4xl">
                  {apex.name}
                </h3>
                <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-metallic">
                  {apex.tag}
                </p>
                <p className="mt-6 flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-semibold text-metallic">
                    {apex.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {apex.cadence}
                  </span>
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {apex.note}
                </p>
                <ButtonLink
                  href="#contact"
                  size="lg"
                  className="sheen group mt-8 h-12 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
                >
                  {apex.cta}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
              </div>

              {/* Right: full feature set */}
              <div className="lg:w-[62%] lg:border-l lg:border-white/[0.08] lg:pl-12">
                <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  {apex.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </Reveal>

      {/* Supporting blocks: Add-ons + Care plans */}
      <div className="mt-20 grid gap-5 lg:grid-cols-5">
        {/* Add-ons */}
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-white/8 bg-white/[0.02] p-8">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Add-ons
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Extra work, priced clearly.
            </p>

            <ul className="mt-6 divide-y divide-white/[0.08] border-t border-white/[0.08]">
              {addons.map((a) => (
                <li
                  key={a.item}
                  className="flex items-baseline justify-between gap-6 py-3.5 text-sm"
                >
                  <span className="text-foreground/90">{a.item}</span>
                  <span className="shrink-0 text-right font-mono text-[0.8rem] text-edge/80">
                    {a.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Keep it running */}
        <Reveal delay={0.08} className="lg:col-span-3">
          <div className="h-full rounded-2xl border border-white/8 bg-white/[0.02] p-8">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Keep it running
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              After your build, we keep it live, secure, and fresh.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col rounded-xl border border-white/8 bg-background/40 p-5"
                >
                  <h4 className="font-display text-base font-semibold tracking-tight">
                    {p.name}
                  </h4>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="font-display text-xl font-semibold tracking-tight text-metallic">
                      {p.price}
                    </span>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {p.cadence}
                    </span>
                  </p>

                  <ul className="mt-4 flex-1 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 py-2.5 text-[0.82rem] leading-snug text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-edge" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-edge transition-colors hover:text-edge-bright"
                  >
                    Add {p.name}
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Risk reversal + closing line */}
      <Reveal delay={0.1}>
        <p className="mx-auto mt-16 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Every project starts with a design you approve before we build. If the
          direction is not right, we refine it until it is.
        </p>
        <p className="mt-3 text-center text-sm text-muted-foreground/65">
          Final scope and pricing are confirmed on a quick call.
        </p>
      </Reveal>
    </section>
  );
}
