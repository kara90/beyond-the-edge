"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

/*
  Care plans grid with a monthly / annual toggle. Annual bills 10 months
  (two months free). Fixed plans (Care, Presence) deep-link into the checkout
  carrying the chosen billing; Growth is custom scope and routes to contact.
  Client component so the toggle is interactive; the rest of Pricing stays SSR.
*/

const ANNUAL_MONTHS = 10;

const plans = [
  {
    name: "Care",
    checkoutId: "care",
    monthly: 300,
    anchor: "A part-time marketer: $2,000+ per month",
    features: [
      "We keep your site live and fix any technical issue, so you never have to think about it",
      "One fresh social content piece a month for your channels",
      "Up to 4 small updates a month (text and image changes)",
      "Hosting, security, SSL, and backups",
    ],
    stopDoing:
      "Stop thinking about: hosting, security, broken pages, small text changes.",
  },
  {
    name: "Presence",
    checkoutId: "presence",
    monthly: 600,
    anchor: "A freelance content manager: $1,500+ per month",
    featured: true,
    features: [
      "Everything in Care",
      "Four social content pieces a month, including one short branded video",
      "Automated review requests",
      "Missed-call text back",
      "One content update and light optimization",
      "A one-page monthly summary",
    ],
    note: "Short social videos are quick branded clips for social. Full filmed or produced commercials are a separate add-on.",
    stopDoing:
      "Stop thinking about: what to post, when to post, asking for reviews, missed calls, staying visible.",
  },
  {
    name: "Growth",
    from: true,
    monthly: 1800,
    annualMonths: 11, // heavier plan: one month free on annual, not two
    anchor: "A junior in-house marketer: $4,000+ per month",
    features: [
      "Everything in Presence",
      "Ongoing content and campaign management",
      "Ongoing SEO and Google Business management",
      "Ads creative and performance optimization",
    ],
    note: "Growth is scoped to your business, so it starts with a conversation.",
    stopDoing:
      "Stop thinking about: marketing. All of it. Campaigns, content, SEO, ads creative: handled and reported.",
  },
];

const usd = (n) => "$" + n.toLocaleString("en-US");

export default function CarePlans() {
  const [billing, setBilling] = useState("monthly");
  const annual = billing === "annual";

  return (
    <>
      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-full border border-white/15 bg-white/[0.02] p-1 text-sm">
          {["monthly", "annual"].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={`rounded-full px-4 py-2.5 transition-colors ${
                billing === b
                  ? "bg-edge/15 text-edge"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b === "monthly" ? "Monthly" : "Annual"}
              {b === "annual" && (
                <span className="ml-1.5 text-[0.7rem] text-edge/80">
                  up to 2 months free
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {plans.map((p) => {
          const months = p.annualMonths || ANNUAL_MONTHS;
          const amount = annual ? p.monthly * months : p.monthly;
          const cadence = annual ? "per year" : "per month";
          const priceLabel = `${p.from ? "From " : ""}${usd(amount)}`;
          const freeMonths = 12 - months;
          const href = p.checkoutId
            ? `/checkout?tier=${p.checkoutId}&billing=${billing}`
            : "#contact";
          return (
            <div
              key={p.name}
              className={`spotlight-edge relative flex flex-col rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1.5 ${
                p.featured ? "glass-featured-clear" : "glass-clear"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-primary-foreground">
                  Recommended
                </span>
              )}
              <h4 className="font-display text-base font-semibold tracking-tight">
                {p.name}
              </h4>
              {p.anchor && (
                <p className="mt-2 text-[0.72rem] leading-snug text-muted-foreground/80">
                  {p.anchor}
                </p>
              )}
              <p
                className={`flex flex-wrap items-baseline gap-x-1.5 ${
                  p.anchor ? "mt-1" : "mt-2"
                }`}
              >
                <span className="font-display text-xl font-semibold tracking-tight text-metallic">
                  {priceLabel}
                </span>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {cadence}
                </span>
              </p>
              {annual && freeMonths > 0 && (
                <p className="mt-1 text-[0.7rem] font-medium text-edge/80">
                  {freeMonths} {freeMonths === 1 ? "month" : "months"} free
                </p>
              )}
              <p className="mt-1 text-[0.68rem] leading-snug text-muted-foreground/60">
                {annual
                  ? "Renews annually until cancelled. Cancel anytime by email."
                  : "Renews monthly until cancelled. Cancel anytime by email."}
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

              {p.stopDoing && (
                <p className="mt-3 text-[0.72rem] leading-snug text-muted-foreground/60">
                  {p.stopDoing}
                </p>
              )}
              {p.note && (
                <p className="mt-3 text-[0.72rem] leading-snug text-muted-foreground/70">
                  {p.note}
                </p>
              )}

              <a
                href={href}
                {...(p.checkoutId
                  ? { "data-cta-id": `plan-add-${p.checkoutId}` }
                  : {})}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-edge transition-colors hover:text-edge-bright"
              >
                {p.checkoutId ? `Add ${p.name}` : "Talk to us"}
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
