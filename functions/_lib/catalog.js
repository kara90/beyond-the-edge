/*
  Authoritative server-side catalog. Amounts are in cents (USD). The browser
  only ever sends item ids and quantities; the server looks up the real amount
  here and builds the Stripe line items, so prices can never be tampered with
  from the client.

  Only fixed-price offers are directly payable here. "From $X" tiers (Beyond,
  Apex, Pro App, Growth, App Care) are custom scope and route to a quote.

  Care plans are recurring (kind: "plan"). When any plan is in the order the
  session is created in subscription mode. Annual billing = 10x the monthly
  amount (two months free).
*/
export const CURRENCY = "usd";

export const CATALOG = {
  // Fixed-price one-time build tiers
  liftoff: { name: "Liftoff website", amount: 249700, kind: "tier" },
  orbit: { name: "Orbit website", amount: 349700, kind: "tier" },
  standard_app: { name: "Standard App", amount: 499700, kind: "tier" },

  // One-time add-ons
  extra_page: { name: "Extra page", amount: 15000, kind: "addon", max: 20 },
  brand_video: { name: "Produced brand video", amount: 150000, kind: "addon" },
  logo: { name: "Logo and brand identity", amount: 75000, kind: "addon" },

  // Recurring care plans (monthly amount; annual = amount x 10)
  care: { name: "Care plan", amount: 30000, kind: "plan" },
  presence: { name: "Presence plan", amount: 60000, kind: "plan" },
};

// Months charged when billed annually (two months free).
export const ANNUAL_MONTHS = 10;

function qtyOf(def, raw) {
  const n = parseInt(raw, 10) || 1;
  return Math.max(1, Math.min(def.max || 1, n));
}

function planAmount(def, annual) {
  return annual ? def.amount * ANNUAL_MONTHS : def.amount;
}

/*
  Build Stripe line_items from [{ id, qty }], ignoring anything not in catalog.
  Plans become recurring prices (month or year); everything else is one-time.
  Returns { line_items, hasPlan } so the caller can choose payment vs
  subscription mode.
*/
export function buildOrder(items, billing) {
  const annual = billing === "annual";
  const line_items = [];
  let hasPlan = false;

  for (const it of items || []) {
    const def = CATALOG[it.id];
    if (!def) continue;

    if (def.kind === "plan") {
      hasPlan = true;
      line_items.push({
        price_data: {
          currency: CURRENCY,
          product_data: { name: def.name },
          unit_amount: planAmount(def, annual),
          recurring: { interval: annual ? "year" : "month" },
        },
        quantity: 1,
      });
    } else {
      line_items.push({
        price_data: {
          currency: CURRENCY,
          product_data: { name: def.name },
          unit_amount: def.amount,
        },
        quantity: qtyOf(def, it.qty),
      });
    }
  }

  return { line_items, hasPlan };
}

// A short human summary for metadata / emails.
export function orderSummary(items, billing) {
  const annual = billing === "annual";
  return (items || [])
    .map((it) => {
      const def = CATALOG[it.id];
      if (!def) return null;
      if (def.kind === "plan") {
        return `${def.name} (${annual ? "annual" : "monthly"})`;
      }
      const q = qtyOf(def, it.qty);
      return q > 1 ? `${def.name} x${q}` : def.name;
    })
    .filter(Boolean)
    .join(", ");
}
