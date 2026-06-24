import { Check, ArrowRight, Plus } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";
import CineGrain from "@/components/site/cine-grain";
import { BOOKING_URL } from "@/components/site/config";

/*
  PRICING
  Four one-time build tiers with agency-rate value anchoring. Orbit is the
  recommended pick; Apex (the ultimate tier) renders as a wide flagship band
  below the other three so four options never crowd the row. Beneath: a shared
  "included in every project" strip, payment + risk-reversal lines, the a la
  carte Add-ons, the monthly care Plans, and a short objection-handling FAQ.
  No new styles: reuses the site tokens.
*/

const tiers = [
  {
    name: "Liftoff",
    tag: "The essential",
    anchor: "Typical agency build: $5,000+",
    price: "$2,497",
    cadence: "one-time",
    note: "A clean, professional presence done right.",
    features: [
      "Custom designed website, up to 5 pages",
      "Mobile responsive, fast, and secure",
      "Lead capture and contact form",
      "SEO-ready build: fast, mobile, and structured so search engines can read your site",
      "Basic local search setup: your business, location, and services marked up correctly",
      "Search and analytics setup",
      "Hosting set up and managed by us",
    ],
    cta: "Start your project",
    featured: false,
  },
  {
    name: "Orbit",
    tag: "The standout",
    anchor: "Typical agency build: $10,000+",
    price: "$3,497",
    cadence: "one-time",
    note: "Custom design with motion that sets you apart.",
    features: [
      "Custom design, up to 12 pages",
      "Advanced animations and scroll effects",
      "A conversion funnel built into the site",
      "A set of professionally produced images",
      "One short branded hero video",
      "Advanced on-page SEO: schema markup, keyword-aware structure, and full local optimization",
      "Search Console and sitemap setup, so you start on solid ground",
      "Search and analytics setup",
    ],
    cta: "Start your project",
    featured: true,
  },
  {
    name: "Beyond",
    tag: "The flagship",
    anchor: "Typical agency build: $15,000 to $25,000",
    price: "From $7,500",
    cadence: "one-time",
    note: "Final price scales with scope and complexity.",
    features: [
      "Everything in Orbit, fully bespoke",
      "Complete advanced SEO setup, tuned for speed and local visibility across every page",
      "Flagship design: advanced 3D and custom animation",
      "The look of a $20,000 plus experience",
      "Cinematic hero video",
      "Complete conversion and lead system",
      "Priority build and direct creative direction",
    ],
    cta: "Start your project",
    featured: false,
  },
  {
    name: "Apex",
    tag: "The sky is the offer",
    anchor: "Comparable studio work: $30,000+",
    price: "From $15,000",
    cadence: "one-time",
    note: "For brands that want the best that can be built.",
    features: [
      "Everything in Beyond, with nothing held back",
      "Best-in-class SEO foundation, fully optimized and built to be found",
      "The full signature behind-the-edge experience, custom to your brand",
      "Bespoke 3D, motion, and a cinematic scroll journey",
      "A full cinematic brand film",
      "Complete conversion and growth system",
      "Direct line to the founder and white-glove delivery",
    ],
    cta: "Request the flagship",
    featured: false,
    ultimate: true,
  },
];

// The three columns vs the wide flagship band.
const buildTiers = tiers.filter((t) => !t.ultimate);
const apex = tiers.find((t) => t.ultimate);

const included = [
  "Mobile responsive build",
  "Speed and security",
  "Free SSL",
  "SEO-ready code",
  "Hosting managed by us",
  "A design you approve before we build",
];

const addons = [
  { item: "Extra page", price: "$150 to $250 each" },
  { item: "Produced brand video", price: "from $1,500" },
  { item: "Advanced 3D or custom animation module", price: "from $800" },
  { item: "Professional copywriting", price: "from $150 per page" },
  { item: "Logo and brand identity", price: "from $750" },
  { item: "Online store or booking setup", price: "from $600" },
  { item: "Ongoing SEO program", price: "from $500 per month" },
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
      "Ongoing SEO and Google Business management",
      "Ads creative and performance optimization",
    ],
  },
];

const pricingFaqs = [
  {
    q: "Do I own my website?",
    a: "If you purchase a build, Liftoff, Orbit, Beyond, or Apex, it is yours. We host and manage it so you never have to think about it, and if you ever move on, we provide your files. A free or promotional landing page provided as part of a monthly plan stays part of that plan and remains live for as long as the plan is active. We will always be clear about what is yours to keep before you start.",
  },
  {
    q: "What happens if I pause my monthly plan?",
    a: "Anything you purchased outright is always yours. Anything included free as part of a plan, like a complimentary landing page, stays live while the plan is active. No surprises, we make this clear up front.",
  },
  {
    q: "Could I just build this myself with a website builder?",
    a: "You could. Most business owners do not, because the value is not the building. It is having it done at a level you cannot match, and never having to touch it again.",
  },
  {
    q: "How long does it take?",
    a: "Most builds ship in two to four weeks, depending on the tier and scope.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Small changes are covered by your monthly plan. Anything bigger is a quick, clear quote.",
  },
  {
    q: "Will my site rank on Google?",
    a: "Your site is built SEO-ready: fast, structured, and locally optimized, which gives you the strongest possible foundation to be found. Ongoing ranking work, like Google Business management, reviews, and content, is a separate monthly service, because rankings build over time. We optimize everything we control and are honest about the rest.",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      {/* Full-bleed blue-space ambiance, feathered on every side (no hard box) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(40% 26% at 50% 12%, oklch(0.5 0.2 255 / 0.20), transparent 70%), radial-gradient(70% 55% at 50% 50%, oklch(0.38 0.14 255 / 0.06), transparent 80%), radial-gradient(55% 45% at 50% 92%, oklch(0.42 0.16 255 / 0.09), transparent 78%)",
          maskImage:
            "linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskComposite: "source-in",
        }}
      />
      {/* Content stays centered while the background bleeds full-width */}
      <div className="relative mx-auto max-w-6xl px-6">
      <Reveal className="text-center">
        <div className="flex justify-center">
          <Eyebrow centered>Pricing</Eyebrow>
        </div>
        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-[1.05] sm:text-5xl">
          Built to go beyond the ordinary.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
          Custom design and build for your brand, at a fraction of agency rates.
          Choose where you want to start.
        </p>
      </Reveal>

      {/* Pricing tiers sit over a soft background video, feathered on every side */}
      <div className="relative isolate mt-12">
        <div
          aria-hidden="true"
          className="media-feather-xy pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-screen max-w-none -translate-x-1/2 overflow-hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="hf-liquid h-full w-full object-cover opacity-50 motion-reduce:hidden"
          >
            <source
              src="https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b85a06a414441905c9c6b.mp4"
              type="video/mp4"
            />
          </video>
          {/* Cinematic grain over the footage */}
          <CineGrain opacity={0.1} />
          {/* Readability veil so tier text stays crisp over the video */}
          <div className="absolute inset-0 bg-background/45" />
        </div>

      {/* Included in every project */}
      <Reveal delay={0.05}>
        <div className="spotlight-edge glass-clear rounded-3xl px-6 py-5">
          <div className="flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-edge/80">
              Included in every project
            </span>
            {included.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="size-3.5 shrink-0 text-edge" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Three one-time build tiers */}
      <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-3">
        {buildTiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="h-full">
            <article
              className={`spotlight-edge relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ${
                t.featured
                  ? "glass-featured-clear hover:-translate-y-1.5 lg:-my-3 lg:py-11"
                  : "glass-clear hover:-translate-y-1.5"
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

              <p className="mt-6 text-xs text-muted-foreground/55">{t.anchor}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-2">
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
        <div className="spotlight-edge mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/40 via-edge/20 to-primary/40 p-px shadow-[0_0_110px_-40px_var(--primary)] transition-transform duration-500 hover:-translate-y-1.5">
          <article className="glass-clear sheen relative overflow-hidden rounded-[calc(var(--radius)*2.2-1px)] p-8 sm:p-10">
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
                <p className="mt-6 text-xs text-muted-foreground/55">
                  {apex.anchor}
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-2">
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
      </div>

      {/* Decision helper + payment + risk reversal */}
      <Reveal delay={0.1}>
        <p className="mx-auto mt-12 max-w-xl text-center text-[0.95rem] leading-relaxed text-muted-foreground">
          Not sure which fits?{" "}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium text-edge hover:text-edge-bright"
          >
            Book a quick call
          </a>{" "}
          and we will point you to the right one, honestly.
        </p>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 text-center text-sm text-muted-foreground/75">
          <p>
            Every site we build is SEO-optimized at the code level. Ongoing
            Google ranking work is a separate service, because real rankings
            build over time.
          </p>
          <p>Builds can be split into two payments: half to start, half at launch.</p>
          <p>
            You approve the design before we build. If the direction is not
            right, we refine it until it is.
          </p>
        </div>
      </Reveal>

      {/* Supporting blocks: Add-ons + Care plans — a discreet breathing aura
          (deep space + soft underwater light) sits behind them, no hard shape */}
      <div className="relative isolate mt-20">
        <div
          aria-hidden="true"
          className="aura-breathe pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[92%] max-w-none -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(42% 50% at 50% 46%, oklch(0.55 0.14 245 / 0.16), oklch(0.48 0.12 232 / 0.06) 40%, transparent 72%)",
            filter: "blur(48px)",
          }}
        />
        <div
          aria-hidden="true"
          className="aura-breathe-slow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[95%] w-[52%] max-w-none -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 54%, oklch(0.82 0.12 220 / 0.1), transparent 70%)",
            filter: "blur(56px)",
          }}
        />
        <div className="grid gap-5 lg:grid-cols-5">
        {/* Add-ons */}
        <Reveal className="lg:col-span-2">
          <div className="spotlight-edge glass-clear h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5">
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
          <div className="spotlight-edge glass-clear h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5">
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
                  className="spotlight-edge glass-clear flex flex-col rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1.5"
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
      </div>

      {/* Objection-handling FAQ (pricing-specific) */}
      <Reveal delay={0.05} className="mx-auto mt-20 max-w-3xl">
        <div className="flex justify-center">
          <Eyebrow centered>Good to know</Eyebrow>
        </div>
        <div className="mt-8 divide-y divide-white/8 border-y border-white/8">
          {pricingFaqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-base font-medium">
                {f.q}
                <Plus className="size-5 shrink-0 text-edge transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* Closing line */}
      <Reveal delay={0.1}>
        <p className="mt-12 text-center text-sm text-muted-foreground/65">
          Final scope and pricing are confirmed on a quick call.
        </p>
      </Reveal>
      </div>
    </section>
  );
}
