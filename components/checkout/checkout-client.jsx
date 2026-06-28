"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight, ArrowLeft, Check, Minus, Plus } from "lucide-react";

/*
  On-site checkout. Three steps inside one page: pick one or more products (and
  optionally a recurring care plan) with a live total, fill the required intake,
  then pay via Stripe Embedded Checkout mounted right here (no redirect). The
  browser only sends item ids + billing; the server prices everything.

  Products are multi-select: a website tier AND an app can be bought together.
  The two website tiers (Liftoff / Orbit) are mutually exclusive, as are the
  care plans. A care plan turns the order into a monthly or annual subscription.
*/

// Display catalog. The SERVER is the source of truth for amounts; these labels
// and display prices are for the UI only.
const TIERS = [
  {
    id: "liftoff",
    name: "Liftoff",
    tag: "Website",
    price: 2497,
    kind: "website",
    blurb: "A clean, professional presence, done right.",
  },
  {
    id: "orbit",
    name: "Orbit",
    tag: "Website",
    price: 3497,
    kind: "website",
    blurb: "Custom design with motion that sets you apart.",
  },
  {
    id: "standard_app",
    name: "Standard App",
    tag: "App",
    price: 4997,
    kind: "app",
    blurb: "Turn customers into members who pay every month.",
  },
];

// Recurring care plans (monthly price; annual = price x ANNUAL_MONTHS).
const PLANS = [
  {
    id: "care",
    name: "Care",
    kind: "plan",
    price: 300,
    blurb: "Site kept live, one social post + small updates each month.",
  },
  {
    id: "presence",
    name: "Presence",
    kind: "plan",
    price: 600,
    blurb: "Everything in Care, plus a monthly social video and optimization.",
  },
];

const ANNUAL_MONTHS = 10; // annual = 10 months (two months free)

// Bespoke / "From …" offers. Price scales with scope, so these are shown for
// upsell + anchoring but handled over email rather than charged a fixed amount.
const BESPOKE = [
  {
    name: "Beyond",
    tag: "Website",
    price: "From $7,497",
    desc: "Flagship bespoke site — advanced 3D, cinematic hero video, full conversion system.",
  },
  {
    name: "Apex",
    tag: "Website",
    price: "From $15,000",
    desc: "The ceiling: the full signature experience, bespoke 3D, and a cinematic brand film.",
  },
  {
    name: "Pro App",
    tag: "App",
    price: "From $9,500",
    desc: "Customer accounts, payments, memberships, loyalty, and multiple modules.",
  },
  {
    name: "Growth",
    tag: "Care plan",
    price: "From $1,800/mo",
    desc: "Full content, SEO, Google Business, and ads management — handled for you.",
  },
  {
    name: "App Care",
    tag: "Care plan",
    price: "From $200/mo",
    desc: "Hosting, updates, security, and push-notification management for your app.",
  },
];

// Cross-sell / upsell add-ons, grouped for scannability. Each carries a short
// "why it helps" line. `kinds` controls which selected products surface a group.
const ADDON_GROUPS = [
  {
    title: "Pages & design",
    kinds: ["website"],
    items: [
      {
        id: "extra_page",
        name: "Extra page — standard design",
        price: 150,
        qtyable: true,
        benefit: "A clean, professional page for another service, location, or offer — more pages, more searches you can show up for.",
      },
      {
        id: "extra_page_3d",
        name: "Extra page — advanced 3D",
        price: 250,
        qtyable: true,
        benefit: "A premium animated page that makes a key product or offer unforgettable.",
      },
      {
        id: "anim_module",
        name: "Advanced 3D / animation module",
        price: 800,
        benefit: "Signature motion that makes the whole site feel high-end and memorable.",
      },
    ],
  },
  {
    title: "Brand & content",
    kinds: ["website", "app"],
    items: [
      {
        id: "logo",
        name: "Logo & brand identity",
        price: 750,
        benefit: "A cohesive, professional identity so you look as good as the work you do.",
      },
      {
        id: "copywriting",
        name: "Professional copywriting",
        price: 150,
        qtyable: true,
        benefit: "Words written to sell, not just describe — turns visitors into customers (per page).",
      },
      {
        id: "brand_video",
        name: "Produced brand video",
        price: 1500,
        benefit: "A scroll-stopping hero video that builds instant trust and lifts conversions.",
      },
    ],
  },
  {
    title: "Sell & grow",
    kinds: ["website", "app"],
    items: [
      {
        id: "store_setup",
        name: "Online store or booking setup",
        price: 600,
        benefit: "Take orders or bookings directly on your site, so it earns while you sleep.",
      },
    ],
  },
];

// Kinds where only one item can be chosen at a time (tiers of one thing).
const SINGLE_SELECT_KINDS = new Set(["website", "plan"]);
const ALL_SELECTABLE = [...TIERS, ...PLANS];

const FIELD =
  "w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors focus:border-edge/50 focus:ring-2 focus:ring-edge/20";

const usd = (n) => "$" + n.toLocaleString("en-US");

const stripePromise =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : Promise.resolve(null);

export default function CheckoutClient({ initialTier }) {
  const [step, setStep] = useState("build"); // build | details | pay
  const [picked, setPicked] = useState(() => {
    const start = TIERS.find((t) => t.id === initialTier)?.id || "orbit";
    return { [start]: true };
  });
  const [billing, setBilling] = useState("monthly"); // monthly | annual
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

  // Prefill the product from ?tier= (read client-side; this is a static export).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const def = ALL_SELECTABLE.find((x) => x.id === params.get("tier"));
      if (def) setPicked((p) => withPick(p, def, true));
      const b = params.get("billing");
      if (b === "annual" || b === "monthly") setBilling(b);
    } catch {}
  }, []);

  const selectedProducts = TIERS.filter((t) => picked[t.id]);
  const selectedPlan = PLANS.find((p) => picked[p.id]) || null;
  const selectedKinds = useMemo(
    () => [...new Set(selectedProducts.map((t) => t.kind))],
    [selectedProducts]
  );

  // Add-on groups whose kinds match the selected products; flattened for totals.
  const availableGroups = useMemo(
    () => ADDON_GROUPS.filter((g) => g.kinds.some((k) => selectedKinds.includes(k))),
    [selectedKinds]
  );
  const availableAddons = useMemo(
    () => availableGroups.flatMap((g) => g.items),
    [availableGroups]
  );

  const selectedAddons = availableAddons.filter((a) => (qty[a.id] || 0) > 0);

  const oneTimeTotal =
    selectedProducts.reduce((s, t) => s + t.price, 0) +
    selectedAddons.reduce((s, a) => s + a.price * (qty[a.id] || 1), 0);
  const planToday = selectedPlan
    ? billing === "annual"
      ? selectedPlan.price * ANNUAL_MONTHS
      : selectedPlan.price
    : 0;
  const total = oneTimeTotal + planToday;

  // Item payload sent to the server (ids + quantities only).
  const items = useMemo(() => {
    const out = selectedProducts.map((t) => ({ id: t.id, qty: 1 }));
    if (selectedPlan) out.push({ id: selectedPlan.id, qty: 1 });
    for (const a of selectedAddons) out.push({ id: a.id, qty: qty[a.id] || 1 });
    return out;
  }, [selectedProducts, selectedPlan, selectedAddons, qty]);

  const togglePick = (item) => setPicked((p) => withPick(p, item, !p[item.id]));
  const toggleAddon = (a) => setQty((q) => ({ ...q, [a.id]: q[a.id] ? 0 : 1 }));
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

  const canContinue = selectedProducts.length > 0 || !!selectedPlan;

  return (
    <div className="mx-auto max-w-5xl">
      <Steps step={step} />

      {step === "build" && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold">Choose your build</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a website, an app, or both. Add-ons appear below.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {TIERS.map((t) => {
                const on = !!picked[t.id];
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => togglePick(t)}
                    aria-pressed={on}
                    className={`spotlight-edge relative rounded-2xl border p-5 text-left transition-all ${
                      on
                        ? "border-edge/50 bg-edge/[0.06]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <SelectBadge on={on} />
                    <p className="font-mono text-[0.62rem] uppercase tracking-widest text-edge/70">
                      {t.tag}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold">{t.name}</p>
                    <p className="mt-1 text-metallic">{usd(t.price)}</p>
                    {t.blurb && (
                      <p className="mt-2 text-xs leading-snug text-muted-foreground">
                        {t.blurb}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedProducts.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground/70">
                Tip: pair a website with the app to add a recurring revenue
                stream, or stack add-ons below. It all goes on one order.
              </p>
            )}

            {availableGroups.length > 0 && (
              <>
                <h2 className="mt-10 text-lg font-semibold">Make it work harder</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Optional upgrades, added to this same order. Each is a quick win
                  for your offer.
                </p>
                <div className="mt-5 space-y-7">
                  {availableGroups.map((g) => (
                    <div key={g.title}>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-edge/70">
                        {g.title}
                      </p>
                      <div className="mt-3 space-y-3">
                        {g.items.map((a) => {
                          const on = (qty[a.id] || 0) > 0;
                          return (
                            <div
                              key={a.id}
                              className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                                on
                                  ? "border-edge/40 bg-edge/[0.05]"
                                  : "border-white/10 bg-white/[0.02]"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => toggleAddon(a)}
                                className="flex flex-1 items-start gap-3 text-left"
                              >
                                <span
                                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[5px] border ${
                                    on ? "border-edge bg-edge/15" : "border-white/25"
                                  }`}
                                >
                                  {on && <Check className="size-3.5 text-edge" />}
                                </span>
                                <span>
                                  <span className="flex flex-wrap items-baseline gap-x-2">
                                    <span className="text-sm font-medium text-foreground">
                                      {a.name}
                                    </span>
                                    <span className="text-xs text-metallic">
                                      {usd(a.price)}
                                      {a.qtyable ? " each" : ""}
                                    </span>
                                  </span>
                                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                    {a.benefit}
                                  </span>
                                </span>
                              </button>
                              {a.qtyable && on && (
                                <div className="flex shrink-0 items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => bump(a, -1)}
                                    className="grid size-7 place-items-center rounded-md border border-white/15 text-foreground hover:border-white/30"
                                  >
                                    <Minus className="size-3.5" />
                                  </button>
                                  <span className="w-5 text-center text-sm">
                                    {qty[a.id]}
                                  </span>
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
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Recurring care plans */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Keep growing</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Optional care plan, handled every month. Cancel anytime.
                </p>
              </div>
              <BillingToggle billing={billing} setBilling={setBilling} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PLANS.map((p) => {
                const on = !!picked[p.id];
                const amount =
                  billing === "annual" ? p.price * ANNUAL_MONTHS : p.price;
                const per = billing === "annual" ? "/year" : "/month";
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePick(p)}
                    aria-pressed={on}
                    className={`spotlight-edge relative rounded-2xl border p-5 text-left transition-all ${
                      on
                        ? "border-edge/50 bg-edge/[0.06]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <SelectBadge on={on} />
                    <p className="font-mono text-[0.62rem] uppercase tracking-widest text-edge/70">
                      Care plan
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold">{p.name}</p>
                    <p className="mt-1 text-metallic">
                      {usd(amount)}
                      <span className="text-sm text-muted-foreground">{per}</span>
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {p.blurb}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Bespoke / email tiers */}
            <h2 className="mt-10 text-lg font-semibold">Going bigger?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Flagship and custom-scope offers. Because the price scales with what
              you need, we scope and quote these over email.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {BESPOKE.map((b) => (
                <div
                  key={b.name}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-base font-semibold">{b.name}</p>
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-edge/70">
                      {b.tag}
                    </p>
                  </div>
                  <p className="mt-1 text-metallic">{b.price}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {b.desc}
                  </p>
                  <a
                    href="/#contact"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-edge transition-colors hover:text-edge-bright"
                  >
                    Email us
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <Summary
            products={selectedProducts}
            selectedAddons={selectedAddons}
            qty={qty}
            plan={selectedPlan}
            billing={billing}
            planToday={planToday}
            total={total}
          >
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => canContinue && setStep("details")}
              className="sheen group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            {!canContinue && (
              <p className="mt-3 text-center text-xs text-muted-foreground/70">
                Select at least one product or plan to continue.
              </p>
            )}
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
          <Summary
            products={selectedProducts}
            selectedAddons={selectedAddons}
            qty={qty}
            plan={selectedPlan}
            billing={billing}
            planToday={planToday}
            total={total}
          />
        </div>
      )}

      {step === "pay" && (
        <PayStep
          items={items}
          billing={billing}
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

// Toggle an item on/off, enforcing single-select within its kind.
function withPick(picked, item, on) {
  const next = { ...picked };
  if (on && SINGLE_SELECT_KINDS.has(item.kind)) {
    for (const x of ALL_SELECTABLE) if (x.kind === item.kind) next[x.id] = false;
  }
  next[item.id] = on;
  return next;
}

function SelectBadge({ on }) {
  return (
    <span
      className={`absolute right-3 top-3 grid size-5 place-items-center rounded-full border transition-colors ${
        on ? "border-edge bg-edge/15 text-edge" : "border-white/20 text-transparent"
      }`}
    >
      <Check className="size-3" />
    </span>
  );
}

function BillingToggle({ billing, setBilling }) {
  return (
    <div className="inline-flex rounded-full border border-white/15 bg-white/[0.02] p-1 text-sm">
      {["monthly", "annual"].map((b) => (
        <button
          key={b}
          type="button"
          onClick={() => setBilling(b)}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            billing === b
              ? "bg-edge/15 text-edge"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {b === "monthly" ? "Monthly" : "Annual"}
          {b === "annual" && (
            <span className="ml-1.5 text-[0.7rem] text-edge/80">2 months free</span>
          )}
        </button>
      ))}
    </div>
  );
}

function PayStep({ items, billing, intake, total, payError, setPayError, onBack }) {
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
        checkout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => {
            const res = await fetch("/api/checkout", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ items, billing, intake }),
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

function Summary({ products, selectedAddons, qty, plan, billing, planToday, total, children }) {
  const recurring =
    plan &&
    (billing === "annual"
      ? `Renews at ${usd(plan.price * ANNUAL_MONTHS)}/year`
      : `Then ${usd(plan.price)}/month`);
  const empty = products.length === 0 && !plan && selectedAddons.length === 0;
  return (
    <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:sticky lg:top-24">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-edge/70">
        Your order
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {empty && (
          <li className="text-muted-foreground/70">Nothing selected yet.</li>
        )}
        {products.map((t) => (
          <li key={t.id} className="flex justify-between gap-3">
            <span className="text-foreground">{t.name}</span>
            <span className="text-muted-foreground">{usd(t.price)}</span>
          </li>
        ))}
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
        {plan && (
          <li className="flex justify-between gap-3">
            <span className="text-foreground">
              {plan.name} plan{" "}
              <span className="text-xs text-muted-foreground">
                ({billing === "annual" ? "annual" : "monthly"})
              </span>
            </span>
            <span className="text-muted-foreground">{usd(planToday)}</span>
          </li>
        )}
      </ul>
      <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
        <span className="text-sm font-medium">Total due today</span>
        <span className="font-display text-xl font-semibold text-metallic">
          {usd(total)}
        </span>
      </div>
      {recurring && (
        <p className="mt-2 text-right text-xs text-muted-foreground">{recurring}</p>
      )}
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
