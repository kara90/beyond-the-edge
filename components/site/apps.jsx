import {
  TrendingUp,
  Heart,
  Workflow,
  CreditCard,
  UserCircle,
  CalendarCheck,
  Gift,
  Smartphone,
  Check,
} from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  Apps — sells the business outcome (recurring revenue, loyalty, scale), not an
  app. These are installable web apps that work on iPhone and Android. Honest
  framing: "everything your business needs," never "everything native can do."
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
    icon: CreditCard,
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
    icon: UserCircle,
    title: "Accounts and client portals",
    items: [
      "Customer login and accounts",
      "A private client portal for each customer",
      "Saved details, history, and preferences",
      "Secure sign-in and sign-out",
    ],
  },
  {
    icon: CalendarCheck,
    title: "Bookings and operations",
    items: [
      "Online booking and appointment scheduling",
      "Orders, reservations, and service requests",
      "Automatic reminders and confirmations",
      "A calendar that fills itself",
    ],
  },
  {
    icon: Gift,
    title: "Loyalty and retention",
    items: [
      "Loyalty points and rewards",
      "Member-only content and pricing",
      "Push notifications that bring customers back",
      "Offers and announcements straight to their phone",
    ],
  },
  {
    icon: Smartphone,
    title: "Built for the business",
    items: [
      "Installs on iPhone and Android",
      "Works offline",
      "Matched to your brand",
      "One system that runs your day-to-day",
    ],
  },
];

export default function Apps() {
  return (
    <section id="apps" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <Eyebrow centered>Apps that grow your business</Eyebrow>
          </div>
          <h2 className="mt-6 text-3xl font-semibold leading-[1.08] sm:text-5xl">
            Turn one-time customers into members who come back, and pay,
            <span className="text-metallic"> every month.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A real app on iPhone and Android that adds a recurring revenue
            stream, keeps your customers loyal, and lets you grow without hiring
            more people. Everything your business needs, without the heavy native
            price tag.
          </p>
        </Reveal>

        {/* Growth-angle benefit blocks */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08} className="h-full">
              <div className="spotlight-edge group h-full rounded-2xl border border-white/8 bg-white/[0.02] p-8 transition-all duration-500 hover:-top-1.5 hover:border-edge/30 hover:bg-white/[0.04]">
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

        {/* Proof of how: the feature set, grouped and scannable */}
        <Reveal delay={0.05}>
          <p className="mt-20 text-center font-mono text-[0.7rem] uppercase tracking-[0.28em] text-edge/80">
            Everything inside
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.05} className="h-full">
              <div className="spotlight-edge h-full rounded-2xl border border-white/8 bg-white/[0.02] p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-edge">
                    <g.icon className="size-4" />
                  </span>
                  <h3 className="font-display text-base font-semibold">
                    {g.title}
                  </h3>
                </div>
                <ul className="mt-5 space-y-2.5">
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
            </Reveal>
          ))}
        </div>

        {/* The investment frame */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-lg leading-relaxed text-foreground/90">
            An app that turns even a handful of one-time customers into monthly
            members pays for itself. Everything a business needs, on every phone,
            without the <span className="text-metallic">$20,000 native price tag</span>,
            because we build it smarter.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
