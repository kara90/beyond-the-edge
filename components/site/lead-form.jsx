"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FORM_ENDPOINT } from "@/components/site/config";

const NEEDS = ["New website", "Video", "Both", "Not sure"];

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-edge/50 focus:ring-2 focus:ring-edge/20";

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
        <h3 className="mt-5 text-xl font-semibold">Your message is in.</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          We reply within one business day. If it is urgent, book a call and we
          will talk sooner.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="spotlight-edge rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-left"
    >
      <div className="grid gap-5 sm:grid-cols-2">
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
          <label htmlFor="lf-need" className="mb-2 block text-sm font-medium">
            What do you need
          </label>
          <select
            id="lf-need"
            name="need"
            required
            defaultValue=""
            className={`${FIELD} cursor-pointer bg-[oklch(0.2_0.022_264)]`}
          >
            <option value="" disabled>
              Choose one
            </option>
            {NEEDS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="sheen group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)] disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Sending..." : "Send it over"}
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
