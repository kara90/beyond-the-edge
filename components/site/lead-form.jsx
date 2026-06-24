"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FORM_ENDPOINT } from "@/components/site/config";

/*
  Lead form. Captures the details we need to scope a project on the first
  reply: who they are, where they are starting from, what they want built, and
  which growth pieces they need. Single-choice questions render as selectable
  chips (peer-checked styling, no JS state); marketing is multi-select.
*/

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-edge/50 focus:ring-2 focus:ring-edge/20";

// Are you already working with us?
const RELATIONSHIP = [
  { value: "New here", label: "New here" },
  { value: "Existing client", label: "Already a client" },
];

// Where are you starting from? (covers: new vs existing site, hosting, transfer)
const SITUATION = [
  { value: "No website yet", label: "Starting fresh, no website yet" },
  { value: "Have a website", label: "I have a website to rebuild or improve" },
  { value: "Hosting only", label: "I have hosting but no website" },
  { value: "Website transfer", label: "Transferring an existing website" },
];

// What do you want built?
const PROJECT = [
  { value: "Landing page", label: "Landing page" },
  { value: "Full website", label: "Full website" },
  { value: "Full website + funnel", label: "Full website with a marketing funnel" },
];

// Optional growth firepower (AI-free wording by brand rule).
const MARKETING = [
  "Marketing funnel",
  "Scalable ad campaigns",
  "Campaign tools",
  "Marketing and growth tools",
  "Smart, automated marketing and funnels",
];

function ChipRadio({ name, value, label, defaultChecked }) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="flex h-full items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:border-white/20 peer-checked:border-edge/50 peer-checked:bg-edge/[0.08] peer-checked:text-foreground peer-checked:shadow-[0_0_22px_-8px_var(--edge)] peer-focus-visible:ring-2 peer-focus-visible:ring-edge/30">
        {label}
      </span>
    </label>
  );
}

function ChipCheck({ name, value }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} className="peer sr-only" />
      <span className="flex h-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:border-white/20 peer-checked:border-edge/50 peer-checked:bg-edge/[0.08] peer-checked:text-foreground peer-checked:shadow-[0_0_22px_-8px_var(--edge)] peer-focus-visible:ring-2 peer-focus-visible:ring-edge/30 peer-checked:[&_.lf-box]:border-edge peer-checked:[&_.lf-box]:bg-edge/15 peer-checked:[&_.lf-check]:opacity-100">
        {/* The check indicator is driven from this span (the input's real
            sibling) via descendant-targeting variants, so it toggles reliably. */}
        <span className="lf-box grid size-4 shrink-0 place-items-center rounded-[5px] border border-white/25 text-edge transition-colors">
          <Check className="lf-check size-3 opacity-0 transition-opacity duration-150" />
        </span>
        {value}
      </span>
    </label>
  );
}

function Group({ label, hint, children, cols = "sm:grid-cols-2" }) {
  return (
    <fieldset className="mt-7 border-0 p-0">
      <legend className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </legend>
      {hint && <p className="mb-3 text-xs text-muted-foreground/70">{hint}</p>}
      {!hint && <div className="mb-3" />}
      <div className={`grid gap-2.5 ${cols}`}>{children}</div>
    </fieldset>
  );
}

export default function LeadForm() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    const data = new FormData(e.currentTarget);

    // Preview mode: no real endpoint wired yet, so just show the success state.
    if (FORM_ENDPOINT.includes("REPLACE-ME")) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="spotlight-edge flex flex-col items-center rounded-2xl border border-edge/25 bg-edge/[0.04] p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full border border-edge/40 bg-edge/10 text-edge">
          <Check className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">Your project brief is in.</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          We reply within one business day with a clear next step. If it is
          urgent, book a call and we will talk sooner.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="spotlight-edge relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-left"
    >
      {/* Subtle background video inside the box. screen-blend drops its dark
          background so it reads as part of the box; no scroll/grid effects. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(120% 120% at 50% 45%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 45%, #000 40%, transparent 100%)",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-30 mix-blend-screen motion-reduce:hidden"
        >
          <source
            src="https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b950e817563b473c5f5e6.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Contact details */}
      <div className="relative z-10 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="lf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="lf-business" className="mb-2 block text-sm font-medium">
            Business name
          </label>
          <input
            id="lf-business"
            name="business"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your business"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="lf-email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="lf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@business.com"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="lf-phone" className="mb-2 block text-sm font-medium">
            Phone <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            id="lf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Best number to reach you"
            className={FIELD}
          />
        </div>
      </div>

      {/* Relationship */}
      <Group label="Are you already working with us?">
        {RELATIONSHIP.map((o, i) => (
          <ChipRadio
            key={o.value}
            name="relationship"
            value={o.value}
            label={o.label}
            defaultChecked={i === 0}
          />
        ))}
      </Group>

      {/* Starting point */}
      <Group label="Where are you starting from?">
        {SITUATION.map((o, i) => (
          <ChipRadio
            key={o.value}
            name="situation"
            value={o.value}
            label={o.label}
            defaultChecked={i === 0}
          />
        ))}
      </Group>

      {/* What to build */}
      <Group label="What do you want built?" cols="sm:grid-cols-3">
        {PROJECT.map((o, i) => (
          <ChipRadio
            key={o.value}
            name="project"
            value={o.value}
            label={o.label}
            defaultChecked={i === 1}
          />
        ))}
      </Group>

      {/* Growth firepower */}
      <Group
        label="Add growth firepower"
        hint="Optional. Pick anything you want us to wire in. We will scope it with you."
      >
        {MARKETING.map((m) => (
          <ChipCheck key={m} name="marketing" value={m} />
        ))}
      </Group>

      {/* Details */}
      <div className="mt-7">
        <label htmlFor="lf-details" className="mb-2 block text-sm font-medium">
          Anything else?{" "}
          <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <textarea
          id="lf-details"
          name="details"
          rows={3}
          placeholder="Tell us where the brand is now and where it should be."
          className={`${FIELD} resize-none`}
        />
      </div>

      <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="sheen group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)] disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Sending..." : "Send my project brief"}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        {status === "error" ? (
          <p className="text-sm text-destructive">
            Something went wrong. Email us at hello@beyondtheedgestudio.com.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/70">
            No spam. We reply within one business day.
          </p>
        )}
      </div>
    </form>
  );
}
