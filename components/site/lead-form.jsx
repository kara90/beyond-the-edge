"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import BgVideo from "@/components/site/bg-video";
import CineGrain from "@/components/site/cine-grain";
import { FORM_ENDPOINT } from "@/components/site/config";

/*
  Lead form. Captures the details we need to scope a project on the first
  reply: who they are, where they are starting from, what they want built, and
  which growth pieces they need. Single-choice questions render as selectable
  chips (peer-checked styling, no JS state); marketing is multi-select.

  Submits JSON to the shared Beyond the Edge lead worker (siteId
  "beyond-the-edge"). If the worker is unreachable, the visitor's email app
  opens with the brief pre-filled, so no lead ever hits a dead end.
*/

const FIELD =
  "w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors focus:border-edge/50 focus:ring-2 focus:ring-edge/20";

const FALLBACK_EMAIL = "sebastien@beyondtheedgestudio.com";

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

// Optional growth pieces, in plain buyer language.
const MARKETING = [
  "Booking or online store",
  "Cinematic brand video",
  "Social content every month",
  "Local SEO program",
  "Ad campaigns",
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
      <span className="flex h-full items-center rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-foreground/85 transition-all duration-200 hover:border-white/35 hover:text-foreground peer-checked:border-edge/50 peer-checked:bg-edge/[0.08] peer-checked:text-foreground peer-checked:shadow-[0_0_22px_-8px_var(--edge)] peer-focus-visible:ring-2 peer-focus-visible:ring-edge/30">
        {label}
      </span>
    </label>
  );
}

function ChipCheck({ name, value }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} className="peer sr-only" />
      <span className="flex h-full items-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-foreground/85 transition-all duration-200 hover:border-white/35 hover:text-foreground peer-checked:border-edge/50 peer-checked:bg-edge/[0.08] peer-checked:text-foreground peer-checked:shadow-[0_0_22px_-8px_var(--edge)] peer-focus-visible:ring-2 peer-focus-visible:ring-edge/30 peer-checked:[&_.lf-box]:border-edge peer-checked:[&_.lf-box]:bg-edge/15 peer-checked:[&_.lf-check]:opacity-100">
        {/* The check indicator is driven from this span (the input's real
            sibling) via descendant-targeting variants, so it toggles reliably. */}
        <span className="lf-box grid size-4 shrink-0 place-items-center rounded-[5px] border border-white/40 text-edge transition-colors">
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
      {hint && <p className="mb-3 text-xs text-foreground/60">{hint}</p>}
      {!hint && <div className="mb-3" />}
      <div className={`grid gap-2.5 ${cols}`}>{children}</div>
    </fieldset>
  );
}

// Build a plain-text mailto URL from the form fields, so a failed POST still
// turns into a sendable brief. Newlines travel as %0D%0A per the mailto spec.
function buildMailtoUrl(data) {
  const lines = [];
  for (const key of new Set(data.keys())) {
    if (key === "botcheck") continue;
    const values = data.getAll(key).map(String).filter(Boolean);
    if (values.length === 0) continue;
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    lines.push(`${label}: ${values.join(", ")}`);
  }
  const subject = encodeURIComponent("Project brief");
  // Cap the body so long briefs never overflow practical mailto URL limits.
  const body = encodeURIComponent(lines.join("\r\n").slice(0, 1800));
  return `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
}

export default function LeadForm() {
  // idle | submitting | success | fallback | error
  const [status, setStatus] = useState("idle");
  const [mailtoUrl, setMailtoUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    const data = new FormData(e.currentTarget);

    // Flatten FormData into JSON; multi-value keys become arrays.
    const payload = { siteId: "beyond-the-edge" };
    for (const key of new Set(data.keys())) {
      const values = data.getAll(key).map(String);
      payload[key] = values.length > 1 ? values : values[0];
    }
    const marketing = data.getAll("marketing").map(String).filter(Boolean);
    if (marketing.length > 0) payload.marketing = marketing;
    else delete payload.marketing;
    payload.subject = `New project brief from ${
      String(data.get("name") || "").trim() || "website"
    }`;

    let ok = false;
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      ok = res.ok && json.success === true;
    } catch {
      ok = false;
    }

    if (ok) {
      setStatus("success");
      return;
    }

    // The worker failed: never fake a success. Open the visitor's email app
    // with the brief pre-filled instead.
    try {
      const url = buildMailtoUrl(data);
      setMailtoUrl(url);
      setStatus("fallback");
      window.location.href = url;
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
          urgent, say so in your message and we will get back to you sooner.
        </p>
      </div>
    );
  }

  if (status === "fallback") {
    return (
      <div className="spotlight-edge flex flex-col items-center rounded-2xl border border-edge/25 bg-edge/[0.04] p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full border border-edge/40 bg-edge/10 text-edge">
          <Mail className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">
          One more click and it is on its way.
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Our form is having a moment, so we opened your email app with your
          brief pre-filled. Press send and it reaches the founder directly.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Email app did not open?{" "}
          <a href={mailtoUrl} className="link-underline text-edge">
            Send your brief to {FALLBACK_EMAIL}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-fluid-off
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
        <BgVideo
          src="https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b950e817563b473c5f5e6.mp4"
          poster="/media/contact-poster.webp"
          className="h-full w-full object-cover opacity-[0.18] mix-blend-screen motion-reduce:hidden"
        />
        {/* Black layer to darken the video further */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Cinematic grain over the footage, like the other videos */}
        <CineGrain opacity={0.12} />
      </div>

      {/* Honeypot: humans never see or fill this field */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] top-0 h-px w-px opacity-0"
      />

      {/* Contact details */}
      <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            Business name <span className="text-foreground/55">(optional)</span>
          </label>
          <input
            id="lf-business"
            name="business"
            type="text"
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
            Phone <span className="text-foreground/55">(optional)</span>
          </label>
          <input
            id="lf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Best number"
            className={FIELD}
          />
          <p className="mt-1.5 text-[0.68rem] leading-snug text-foreground/50">
            Only used to talk about your project. No marketing texts without
            your separate consent.
          </p>
        </div>
      </div>

      {/* Project scoping laid out as a wide block instead of one tall stack:
          relationship spans the top, the two core questions sit side by side,
          and growth runs full width below. Collapses to a logical single
          column on mobile. */}
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

      {/* Starting point + what to build, side by side */}
      <div className="md:grid md:grid-cols-2 md:gap-x-8">
        <Group label="Where are you starting from?" cols="grid-cols-1">
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

        <Group label="What do you want built?" cols="grid-cols-1">
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
      </div>

      {/* Growth firepower, full width */}
      <Group
        label="Add growth firepower"
        hint="Optional. Pick anything you want us to wire in. We will scope it with you."
        cols="sm:grid-cols-2"
      >
        {MARKETING.map((m) => (
          <ChipCheck key={m} name="marketing" value={m} />
        ))}
      </Group>

      {/* Details */}
      <div className="mt-7">
        <label htmlFor="lf-details" className="mb-2 block text-sm font-medium">
          Anything else?{" "}
          <span className="text-foreground/55">(optional)</span>
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
            Something went wrong. Email us at {FALLBACK_EMAIL}.
          </p>
        ) : (
          <p className="text-xs text-foreground/60">
            No spam. We reply within one business day.
          </p>
        )}
      </div>
      <p className="mt-3 text-center text-[0.68rem] leading-snug text-foreground/50 sm:text-left">
        By sending this, you agree to our{" "}
        <a
          href="/terms"
          className="link-underline text-edge/80 hover:text-edge-bright"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="link-underline text-edge/80 hover:text-edge-bright"
        >
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
