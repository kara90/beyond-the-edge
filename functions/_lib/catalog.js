/*
  Authoritative server-side catalog. Amounts are in cents (USD). The browser
  only ever sends item ids and quantities; the server looks up the real amount
  here and builds the Stripe line items, so prices can never be tampered with
  from the client.

  Only fixed-price, one-time offers are directly payable here. "From $X" tiers
  (Beyond, Apex, Pro App) are custom scope and route to a quote, not checkout.
  Recurring care plans are handled by Stage 2 (subscriptions).

  NOTE for review: extra_page is set to $200 (the site lists a $150 to $250
  range). Confirm or adjust the amount below.
*/
export const CURRENCY = "usd";

export const CATALOG = {
  // Fixed-price one-time build tiers
  liftoff: { name: "Liftoff website", amount: 249700, kind: "tier" },
  orbit: { name: "Orbit website", amount: 349700, kind: "tier" },
  standard_app: { name: "Standard App", amount: 499700, kind: "tier" },

  // One-time add-ons
  extra_page: { name: "Extra page", amount: 20000, kind: "addon", max: 20 },
  brand_video: { name: "Produced brand video", amount: 150000, kind: "addon" },
  logo: { name: "Logo and brand identity", amount: 75000, kind: "addon" },
};

function qtyOf(def, raw) {
  const n = parseInt(raw, 10) || 1;
  return Math.max(1, Math.min(def.max || 1, n));
}

// Build Stripe line_items from [{ id, qty }], ignoring anything not in catalog.
export function lineItemsFor(items) {
  const out = [];
  for (const it of items || []) {
    const def = CATALOG[it.id];
    if (!def) continue;
    out.push({
      price_data: {
        currency: CURRENCY,
        product_data: { name: def.name },
        unit_amount: def.amount,
      },
      quantity: qtyOf(def, it.qty),
    });
  }
  return out;
}

// A short human summary for metadata / emails.
export function orderSummary(items) {
  return (items || [])
    .map((it) => {
      const def = CATALOG[it.id];
      if (!def) return null;
      const q = qtyOf(def, it.qty);
      return q > 1 ? `${def.name} x${q}` : def.name;
    })
    .filter(Boolean)
    .join(", ");
}
