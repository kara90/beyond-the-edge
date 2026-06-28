"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight, ArrowLeft, Check, Minus, Plus } from "lucide-react";

/*
  On-site checkout (Stage 1, one-time). Three steps inside one page: pick a
  build tier and relevant upsells with a live total, fill the required intake,
  then pay via Stripe Embedded Checkout mounted right here (no redirect). The
  browser only sends item ids; the server prices everything from its catalog.
*/

// Display catalog. The SERVER is the source of truth for amounts; these labels
// and display prices are for the UI only.
const TIERS = [
  { id: "liftoff", name: "Liftoff", tag: "Website", price: 2497, kind: "website" },
  { id: "orbit", name: "Orbit", tag: "Website", price: 3497, kind: "website" },
  { id: "standard_app", name: "Standard App", tag: "App", price: 4997, kind: "app" },
];

const ADDONS = {
  website: [
    { id: "extra_page", name: "Extra page", price: 200, qtyable: true },
    { id: "brand_video", name: "Produced brand video", price: 1500 },
    { id: "logo", name: "Logo and brand identity", price: 750 },
  ],
  app: [
    { id: "logo", name: "Logo and brand identity", price: 750 },
    { id: "brand_video", name: "Produced brand video", price: 1500 },
  ],
};

const FIELD =
  "w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors focus:border-edge/50 focus:ring-2 focus:ring-edge/20";

const usd = (n) => "$" + n.toLocaleString("en-US");

const stripePromise =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : Promise.resolve(null);

export default function CheckoutClient({ initialTier }) {
  const [step, setStep] = useState("build"); // build | details | pay
  const [tierId, setTierId] = useState(
    TIERS.find((t) => t.id === initialTier)?.id || "orbit"
  );
  const [qty, setQty] = useState({}); // addonId -> quantity (>=1 means selected)
  const [intake, setIntake] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    hosting: "",
  });
  const [errors, setErrors] = useState({});
  const [payError, setPayError] = useState("");

  // Prefill the tier from ?tier= (read client-side; this is a static export).
  useEffect(() => {
    try {
      const t = new URLSearchParams(window.location.search).get("tier");
      if (t && TIERS.some((x) => x.id === t)) setTierId(t);
    } catch {}
  }, []);

  const tier = TIERS.find((t) => t.id === tierId);
  const addons = ADDONS[tier.kind] || [];

  const selectedAddons = addons.filter((a) => (qty[a.id] || 0) > 0);
  const total = useMemo(
    () =>
      tier.price +
      selectedAddons.reduce((sum, a) => sum + a.price * (qty[a.id] || 1), 0),
    [tier, selectedAddons, qty]
  );

  // Item payload sent to the server (ids + quantities only).
  const items = useMemo(() => {
    const out = [{ id: tier.id, qty: 1 }];
    for (const a of selectedAddons) out.push({ id: a.id, qty: qty[a.id] || 1 });
    return out;
  }, [tier, selectedAddons, qty]);

  const toggleAddon = (a) =>
    setQty((q) => ({ ...q, [a.id]: q[a.id] ? 0 : 1 }));
  const bump = (a, d) =>
    setQty((q) => ({ ...q, [a.id]: Math.max(0, (q[a.id] || 0) + d) }));

  function validate() {
    const e = {};
    for (const f of ["firstName", "lastName", "email", "phone"]) {
      if (!intake[f].trim()) e[f] = "Required";
    }
    if (intake.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(intake.email))
      e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Steps step={step} />

      {step === "build" && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold">Choose where to start</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTierId(t.id);
                    setQty({});
                  }}
                  className={`spotlight-edge rounded-2xl border p-5 text-left transition-all ${
                    t.id === tierId
                      ? "border-edge/50 bg-edge/[0.06]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <p className="font-mono text-[0.62rem] uppercase tracking-widest text-edge/70">
                    {t.tag}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">{t.name}</p>
                  <p className="mt-1 text-metallic">{usd(t.price)}</p>
                </button>
              ))}
            </div>

            <h2 className="mt-10 text-lg font-semibold">Add what you need</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Optional. The total updates as you go.
            </p>
            <div className="mt-4 space-y-3">
              {addons.map((a) => {
                const on = (qty[a.id] || 0) > 0;
                return (
                  <div
                    key={a.id}
                    className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                      on
                        ? "border-edge/40 bg-edge/[0.05]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAddon(a)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-[5px] border ${
                          on ? "border-edge bg-edge/15" : "border-white/25"
                        }`}
                      >
                        {on && <Check className="size-3.5 text-edge" />}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          {a.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {usd(a.price)}
                          {a.qtyable ? " each" : ""}
                        </span>
                      </span>
                    </button>
                    {a.qtyable && on && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => bump(a, -1)}
                          className="grid size-7 place-items-center rounded-md border border-white/15 text-foreground hover:border-white/30"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm">{qty[a.id]}</span>
                        <button
                          type="button"
                          onClick={() => bump(a, 1)}
                          className="grid size-7 place-items-center rounded-md border border-white/15 text-foreground hover:border-white/30"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/70">
              Custom and flagship tiers (Beyond, Apex, Pro App) and the monthly
              care plans are arranged on a quick call.{" "}
              <a href="/#contact" className="text-edge hover:text-edge-bright">
                Talk to us
              </a>
              .
            </p>
          </div>

          <Summary tier={tier} selectedAddons={selectedAddons} qty={qty} total={total}>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="sheen group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Summary>
        </div>
      )}

      {step === "details" && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold">Your details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              So we can start the moment you pay.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="First name" req v="firstName" {...{ intake, setIntake, errors }} />
              <Input label="Last name" req v="lastName" {...{ intake, setIntake, errors }} />
              <Input label="Email" req type="email" v="email" {...{ intake, setIntake, errors }} />
              <Input label="Phone" req type="tel" v="phone" {...{ intake, setIntake, errors }} />
              <Input label="Company" opt v="company" {...{ intake, setIntake, errors }} />
              <Input label="Current website" opt v="website" placeholder="https://" {...{ intake, setIntake, errors }} />
              <Input label="Current hosting" opt v="hosting" {...{ intake, setIntake, errors }} className="sm:col-span-2" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("build")}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-foreground hover:bg-white/[0.06]"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validate()) {
                    setPayError("");
                    setStep("pay");
                  }
                }}
                className="sheen group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Continue to payment
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <Summary tier={tier} selectedAddons={selectedAddons} qty={qty} total={total} />
        </div>
      )}

      {step === "pay" && (
        <PayStep
          tierId={tierId}
          items={items}
          intake={intake}
          total={total}
          payError={payError}
          setPayError={setPayError}
          onBack={() => setStep("details")}
        />
      )}
    </div>
  );
}

function PayStep({ tierId, items, intake, total, payError, setPayError, onBack }) {
  const ref = useRef(null);

  useEffect(() => {
    let checkout;
    let destroyed = false;
    (async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          setPayError("Payments are not configured yet.");
          return;
        }
        checkout = await stripe.initEmbeddedCheckout({
          fetchClientSecret: async () => {
            const res = await fetch("/api/checkout", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ tier: tierId, items, intake }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || "Could not start checkout.");
            return d.clientSecret;
          },
        });
        if (destroyed) {
          checkout.destroy();
          return;
        }
        checkout.mount(ref.current);
      } catch (e) {
        setPayError(e.message || "Could not start checkout.");
      }
    })();
    return () => {
      destroyed = true;
      try {
        checkout && checkout.destroy();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-foreground hover:bg-white/[0.06]"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <p className="text-sm text-muted-foreground">
          Total due today{" "}
          <span className="font-semibold text-metallic">{usd(total)}</span>
        </p>
      </div>
      {payError && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {payError}
        </p>
      )}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-2 sm:p-4">
        <div ref={ref} id="embedded-checkout" />
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground/70">
        Payments are processed securely by Stripe. Your card details never touch
        our servers.
      </p>
    </div>
  );
}

function Steps({ step }) {
  const order = ["build", "details", "pay"];
  const labels = { build: "Select", details: "Details", pay: "Pay" };
  const idx = order.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-3 text-xs">
      {order.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span
            className={`flex items-center gap-2 ${
              i <= idx ? "text-foreground" : "text-muted-foreground/50"
            }`}
          >
            <span
              className={`grid size-5 place-items-center rounded-full border text-[0.65rem] ${
                i < idx
                  ? "border-edge bg-edge/15 text-edge"
                  : i === idx
                  ? "border-edge text-edge"
                  : "border-white/20"
              }`}
            >
              {i < idx ? <Check className="size-3" /> : i + 1}
            </span>
            <span className="font-mono uppercase tracking-widest">{labels[s]}</span>
          </span>
          {i < order.length - 1 && (
            <span className="h-px w-8 bg-white/15" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

function Summary({ tier, selectedAddons, qty, total, children }) {
  return (
    <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:sticky lg:top-24">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-edge/70">
        Your order
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        <li className="flex justify-between gap-3">
          <span className="text-foreground">{tier.name}</span>
          <span className="text-muted-foreground">{usd(tier.price)}</span>
        </li>
        {selectedAddons.map((a) => (
          <li key={a.id} className="flex justify-between gap-3">
            <span className="text-foreground">
              {a.name}
              {(qty[a.id] || 1) > 1 ? ` x${qty[a.id]}` : ""}
            </span>
            <span className="text-muted-foreground">
              {usd(a.price * (qty[a.id] || 1))}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
        <span className="text-sm font-medium">Total</span>
        <span className="font-display text-xl font-semibold text-metallic">
          {usd(total)}
        </span>
      </div>
      {children}
    </aside>
  );
}

function Input({ label, v, req, opt, type = "text", placeholder, className = "", intake, setIntake, errors }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium">
        {label}{" "}
        {opt && <span className="text-muted-foreground/55">(optional)</span>}
      </label>
      <input
        type={type}
        value={intake[v]}
        placeholder={placeholder}
        onChange={(e) => setIntake((s) => ({ ...s, [v]: e.target.value }))}
        className={`${FIELD} ${errors[v] ? "border-destructive/60" : ""}`}
      />
      {errors[v] && <p className="mt-1 text-xs text-destructive">{errors[v]}</p>}
    </div>
  );
}
