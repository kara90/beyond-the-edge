"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

/*
  Signature block for /agree/[slug]. All boxes start unchecked and every one
  is required; submit stays disabled until each box is checked and the full
  legal name is typed. The server (functions/api/sign.js) revalidates
  everything and writes the acceptance record; success is only shown after
  the server confirms the record was stored.
*/

const FIELD =
  "w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors focus:border-edge/50 focus:ring-2 focus:ring-edge/20";

const usd = (n) => "$" + Number(n).toLocaleString("en-US");

function CheckRow({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[var(--edge)]"
      />
      <span className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </span>
    </label>
  );
}

export default function SignForm({ deal, agreementNames }) {
  const isComplimentary = deal.agreementType === "complimentary-build";

  const [checks, setChecks] = useState({
    readAgree: false,
    compTerms: false,
    esign: false,
  });
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [business, setBusiness] = useState(deal.businessName || "");
  const [email, setEmail] = useState(deal.email || "");
  // idle | submitting | signed | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { dateStyle: "long" }));
    // Static pages outlive their build: re-check expiry at view time.
    if (deal.expiresAt && new Date(deal.expiresAt) < new Date()) {
      setExpired(true);
    }
  }, [deal.expiresAt]);

  const namesJoined = agreementNames.join(" and ");

  const complete = useMemo(() => {
    if (!checks.readAgree || !checks.esign) return false;
    if (isComplimentary && !checks.compTerms) return false;
    return name.trim().length > 1;
  }, [checks, name, isComplimentary]);

  async function submit() {
    if (!complete || status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: deal.slug,
          checks: {
            readAgree: checks.readAgree,
            esign: checks.esign,
            ...(isComplimentary ? { compTerms: checks.compTerms } : {}),
          },
          name,
          title,
          business,
          email,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        setStatus("signed");
      } else {
        setStatus("error");
        setError(d.error || "Could not record the signature. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Could not reach the server. Please try again.");
    }
  }

  if (expired) {
    return (
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <p className="text-base leading-relaxed text-muted-foreground">
          This agreement link has expired. Email us and we will send a fresh
          one:{" "}
          <a
            href="mailto:sebastien@beyondtheedgestudio.com"
            className="link-underline text-edge hover:text-edge-bright"
          >
            sebastien@beyondtheedgestudio.com
          </a>
        </p>
      </div>
    );
  }

  if (status === "signed") {
    return (
      <div className="spotlight-edge mt-10 flex flex-col items-center rounded-2xl border border-edge/25 bg-edge/[0.04] p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full border border-edge/40 bg-edge/10 text-edge">
          <Check className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">
          Signed. A copy is in your email.
        </h3>
        {deal.paymentUrl ? (
          <a
            href={deal.paymentUrl}
            className="sheen mt-7 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            Complete your first payment
          </a>
        ) : (
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            We reach out within one business day with your kickoff details.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">Acknowledge and sign</h2>
      <div className="mt-4 space-y-3">
        <CheckRow
          checked={checks.readAgree}
          onChange={(v) => setChecks((c) => ({ ...c, readAgree: v }))}
        >
          I have read and agree to the {namesJoined}.
        </CheckRow>
        {isComplimentary && (
          <CheckRow
            checked={checks.compTerms}
            onChange={(v) => setChecks((c) => ({ ...c, compTerms: v }))}
          >
            I understand my site is provided as part of my monthly plan:{" "}
            {usd(deal.price)} per month, {deal.minimumTermMonths} month minimum
            term, and I can buy it outright at any time for{" "}
            {usd(deal.buyoutPrice)}.
          </CheckRow>
        )}
        <CheckRow
          checked={checks.esign}
          onChange={(v) => setChecks((c) => ({ ...c, esign: v }))}
        >
          I agree that checking these boxes and typing my name below is my
          electronic signature under the E-SIGN Act and Nevada UETA.
        </CheckRow>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sig-name" className="mb-1.5 block text-sm font-medium">
            Full legal name
          </label>
          <input
            id="sig-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full legal name"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="sig-title" className="mb-1.5 block text-sm font-medium">
            Title <span className="text-foreground/55">(optional)</span>
          </label>
          <input
            id="sig-title"
            type="text"
            autoComplete="organization-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Owner"
            className={FIELD}
          />
        </div>
        <div>
          <label
            htmlFor="sig-business"
            className="mb-1.5 block text-sm font-medium"
          >
            Business name
          </label>
          <input
            id="sig-business"
            type="text"
            autoComplete="organization"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="sig-email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="sig-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={FIELD}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/70">Date: {today}</p>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!complete || status === "submitting"}
        onClick={submit}
        className="sheen mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {status === "submitting" ? "Recording your signature..." : "Sign the agreement"}
      </button>
      {!complete && (
        <p className="mt-2 text-xs text-muted-foreground/70">
          Check every box and type your full legal name to sign.
        </p>
      )}
    </div>
  );
}
