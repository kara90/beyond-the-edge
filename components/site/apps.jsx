import { TrendingUp, Heart, Workflow, Check } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  Apps: sells the business outcome (recurring revenue, loyalty, scale), not an
  app. These are installable web apps that work on iPhone and Android. Honest
  framing: "everything your business needs," never "everything native can do."
  The section is self-contained: benefits, the full feature set in one panel,
  the investment frame, then the two app tiers and the App Care bar.
*/
const benefits = [
  {
    icon: TrendingUp,
    title: "A recurring revenue stream",
    body: "Turn customers into members and subscribers who pay you every month. Predictable income, instead of chasing the next sale. Memberships, subscriptions, and packages that renew on their own.",
  },
  {
    icon: Heart,
    title: "Customers who do not shop around",
    body: "Your app lives on their phone, with their account, their points, and their history. That is a relationship competitors cannot easily take. Once they are in your app, they come back to you.",
  },
  {
    icon: Workflow,
    title: "Grow without more work",
    body: "Bookings, payments, reminders, and reordering all happen automatically. Serve more customers without hiring more staff. The app runs the day-to-day so you can focus on growth.",
  },
];

const groups = [
  {
    title: "Payments and revenue",
    items: [
      "Take payments in-app, including cards, Apple Pay, and Google Pay",
      "Sell products, services, or packages",
      "Subscriptions and recurring monthly billing",
      "Memberships that auto-renew",
      "Invoices and deposits",
    ],
  },
  {
    title: "Accounts and client portals",
    items: [
      "Customer login and accounts",
      "A private client portal for each customer",
      "Saved details, history, and preferences",
      "Secure sign-in and sign-out",
    ],
  },
  {
    title: "Bookings and operations",
    items: [
      "Online booking and appointment scheduling",
      "Orders, reservations, and service requests",
      "Automatic reminders and confirmations",
      "A calendar that fills itself",
    ],
  },
  {
    title: "Loyalty and retention",
    items: [
      "Loyalty points and rewards",
      "Member-only content and pricing",
      "Push notifications that bring customers back",
      "Offers and announcements straight to their phone",
    ],
  },
  {
    title: "Built for the business",
    items: [
      "Installs on iPhone and Android",
      "Works offline",
      "Matched to your brand",
      "One system that runs your day-to-day",
    ],
  },
];

// Apps: a distinct product line. Installable web apps on iPhone and Android.
const appTiers = [
  {
    name: "Standard App",
    checkoutId: "standard_app",
    tag: "The essential app",
    anchor: "Comparable native development: $20,000+",
    price: "$4,997",
    cadence: "one-time",
    note: "Your business as an app on iPhone and Android.",
    features: [
      "Installable on iPhone and Android, works offline",
      "App-style design matched to your brand",
      "Push notifications that bring customers back",
      "Your core feature: booking, ordering, menu, or content",
      "Secure customer login",
    ],
    cta: "Start your app",
    featured: false,
  },
  {
    name: "Pro App",
    tag: "The growth engine",
    anchor: "Comparable native development: $30,000+",
    price: "From $9,500",
    cadence: "one-time",
    note: "Final price scales with features and scope.",
    features: [
      "Everything in Standard",
      "Customer accounts and private portals",
      "Payments, subscriptions, and recurring billing",
      "Ordering, reservations, or memberships",
      "Loyalty and rewards that drive repeat business",
      "Integrations and multiple modules",
    ],
    cta: "Request a Pro app",
    featured: true,
  },
];

const appCare = {
  name: "App Care",
  price: "From $300",
  cadence: "per month",
  features: [
    "Hosting, updates, and security",
    "Push notification management",
    "We keep it running and fix any technical issue",
  ],
};

export default function Apps() {
  return (
    <section id="apps" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <Eyebrow centered>Apps that grow your business</Eyebrow>
          </div>
          <h2 className="mt-6 text-3xl font-semibold leading-[1.08] sm:text-5xl">
            Turn one-time customers into members who pay you
            <span className="text-metallic"> every single month.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Your business as a real app on iPhone and Android: a recurring
            revenue stream, customers who stop shopping around, and growth
            without extra staff. Built smarter, so it costs a fraction of the
            $20,000 native quote.
          </p>
        </Reveal>

        {/* Growth-angle benefit blocks */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08} className="h-full">
              <div className="spotlight-edge group h-full rounded-2xl border border-white/8 bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-edge/30 hover:bg-white/[0.04]">
                <span className="inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-edge transition-all duration-500 group-hover:border-edge/40 group-hover:shadow-[0_0_22px_-4px_var(--edge)]">
                  <b.icon className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{b.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Proof of how: the full feature set in one calm panel */}
        <Reveal delay={0.05}>
          <p className="mt-20 text-center font-mono text-[0.7rem] uppercase tracking-[0.28em] text-edge/80">
            Everything inside
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="spotlight-edge glass-clear mt-8 rounded-3xl p-8 sm:p-10">
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((g) => (
                <div key={g.title}>
                  <h3 className="font-display text-base font-semibold">
                    {g.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-edge" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* The investment frame */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-lg leading-relaxed text-foreground/90">
            Do the math: ten members at $50 a month is $6,000 a year, on
            autopilot. The app pays for itself with a handful of customers, on
            every phone, without the{" "}
            <span className="text-metallic">$20,000 native price tag</span>,
            because we build it smarter.
          </p>
        </Reveal>

        {/* The two app tiers */}
        <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 sm:grid-cols-2">
          {appTiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="h-full">
              <article
                className={`spotlight-edge relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 ${
                  t.featured ? "glass-featured-clear" : "glass-clear"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-primary-foreground">
                    Recommended
                  </span>
                )}
                <h4 className="font-display text-xl font-semibold tracking-tight">
                  {t.name}
                </h4>
                <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-edge/70">
                  {t.tag}
                </p>
                <p className="mt-6 text-xs text-muted-foreground/80">{t.anchor}</p>
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
                  href={t.checkoutId ? `/checkout?tier=${t.checkoutId}` : "#contact"}
                  size="lg"
                  variant={t.featured ? "default" : "outline"}
                  data-cta-id={`apps-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
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

        {/* App Care */}
        <Reveal delay={0.1} className="mx-auto mt-5 max-w-4xl">
          <div className="spotlight-edge glass-clear flex flex-col gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="shrink-0">
              <h4 className="font-display text-base font-semibold">
                {appCare.name}
              </h4>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-xl font-semibold text-metallic">
                  {appCare.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  {appCare.cadence}
                </span>
              </p>
              <p className="mt-1 text-[0.68rem] leading-snug text-muted-foreground/60">
                Renews monthly until cancelled. Cancel anytime by email.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {appCare.features.map((f) => (
                <li key={f} className="inline-flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-edge" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
