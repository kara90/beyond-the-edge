import { Globe, Clapperboard, Zap, Smartphone, ArrowUpRight, Check } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  Services: one system, four parts. Websites, the automation engine, cinematic
  video, and apps, as a 2x2 grid on desktop. Below it, the "invisible engine"
  strip lists the follow-up machinery every build can run on.
*/
const SERVICES = [
  {
    icon: Globe,
    title: "Websites",
    meta: "Design · Build · Launch",
    body: "A site that makes a local business look national. Fast, cinematic, and built for one job: turning visitors into calls, bookings, and paying customers.",
  },
  {
    icon: Zap,
    title: "Automation and growth",
    meta: "Follow-up · Booking · Social",
    body: "Leads answered in seconds, not hours. Missed calls get an instant text back. Booking, reminders, review requests, follow-up emails and texts, and social posts that go out on schedule. The invisible engine most builders never install, running under your site from day one, powered by our own automation infrastructure.",
  },
  {
    icon: Clapperboard,
    title: "Cinematic video",
    meta: "Brand films · Social",
    body: "Brand films and social cuts with real direction behind them, the kind of production big brands pay six figures for, brought to your business at a price that makes sense. Footage your competitors simply cannot match. Produced video is included where a tier lists it; on-location filming with crew and gear is quoted per production.",
  },
  {
    icon: Smartphone,
    title: "Apps",
    meta: "Members · Loyalty · Push",
    href: "#apps",
    body: "Your business as an app on iPhone and Android: memberships, loyalty, push notifications, and payments. The lock-in your competitors cannot copy.",
  },
];

const ENGINE = [
  "Instant lead reply",
  "Missed-call text back",
  "Booking and reminders",
  "Review requests",
  "Social scheduling",
  "Email and text follow-up",
];

function CardInner({ s }) {
  return (
    <>
      {/* Accent line that draws across the top on hover */}
      <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-edge to-transparent transition-transform duration-500 group-hover:scale-x-100" />

      <span className="relative inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-edge transition-all duration-500 group-hover:border-edge/40 group-hover:shadow-[0_0_22px_-4px_var(--edge)]">
        <s.icon className="size-5 transition-transform duration-500 group-hover:scale-110" />
      </span>

      <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted-foreground">
        {s.body}
      </p>

      <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/70">
          {s.meta}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-edge" />
      </div>
    </>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36"
    >
      <Reveal>
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.08] sm:text-5xl">
          One system turns how you look into what you earn.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {SERVICES.map((s, i) => {
          const cardClass =
            "spotlight-edge group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-edge/30 hover:bg-white/[0.04] hover:shadow-[0_24px_70px_-24px_oklch(0.82_0.12_220/0.3)]";
          return (
            <Reveal key={s.title} delay={i * 0.08} className="h-full">
              {s.href ? (
                <a href={s.href} className={cardClass}>
                  <CardInner s={s} />
                </a>
              ) : (
                <article className={cardClass}>
                  <CardInner s={s} />
                </article>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* The invisible engine: what runs under every build */}
      <Reveal delay={0.1} className="mt-6">
        <div className="spotlight-edge glass-clear rounded-3xl px-6 py-5">
          <div className="flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-edge/80">
              The invisible engine
            </span>
            {ENGINE.map((item) => (
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
    </section>
  );
}
