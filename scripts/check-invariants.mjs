// LOCKED INVARIANTS CHECK. Runs before every build (npm prebuild), locally
// and on Cloudflare Pages, so a deploy that shifts locked content FAILS
// instead of silently going live.
//
// These locks are Sebastien's standing order (2026-07-03): legal copy,
// prices, structure, and house rules are frozen. If a change here is truly
// intended, he approves it first, and this file is updated in the SAME
// commit as the change. Do not weaken a check to make a build pass.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const read = (p) => readFileSync(join(root, p), "utf8");

function mustInclude(file, needle, label) {
  if (!read(file).includes(needle)) {
    failures.push(`${file}: missing locked ${label}: "${needle.slice(0, 70)}"`);
  }
}
function mustNotMatch(file, regex, label) {
  const m = read(file).match(regex);
  if (m) failures.push(`${file}: contains banned ${label}: "${String(m[0]).slice(0, 60)}"`);
}

// ── 1) Legal copy locks (exact strings) ─────────────────────────────────
mustInclude(
  "components/site/pricing.jsx",
  "Standard plans are month to month, cancel anytime.",
  "standard-plans scope"
);
mustInclude(
  "components/site/faq.jsx",
  "Every build includes three rounds of design refinement",
  "revision-rounds promise"
);
mustInclude(
  "components/site/pricing.jsx",
  "$49 per month hosting rate",
  "pause hosting rate"
);
mustInclude(
  "components/site/pricing.jsx",
  "You can also buy your page outright at any time.",
  "buyout line"
);
mustInclude(
  "components/site/faq.jsx",
  "What does hosting cost after launch?",
  "hosting FAQ"
);
mustInclude(
  "components/site/care-plans.jsx",
  "Renews monthly until cancelled. Cancel anytime by email.",
  "renewal microcopy (plans)"
);
// Texting tiers promise an allowance with no surprise overage. Billing promise:
// it must stay on the page next to the tiers that carry it.
mustInclude(
  "components/site/care-plans.jsx",
  "billed in clear top-up blocks, never a",
  "message allowance small print"
);
mustInclude(
  "components/site/faq.jsx",
  "What is the Client Growth dashboard?",
  "Client Growth dashboard FAQ"
);
mustInclude(
  "components/checkout/checkout-client.jsx",
  "including automatic renewal: my plan renews each billing period",
  "checkout consent label"
);
mustInclude(
  "components/checkout/checkout-client.jsx",
  "Deposits are non-refundable once work begins.",
  "refund microcopy"
);
mustInclude(
  "components/site/lead-form.jsx",
  "No marketing texts without",
  "phone-use disclosure"
);
// Old, contract-contradicting strings must never return.
mustNotMatch(
  "components/site/pricing.jsx",
  /Plans are month to month, cancel anytime\. We keep you/,
  "old unscoped month-to-month claim"
);

// ── 2) Price locks (display + server must both hold) ────────────────────
const PRICE_LOCKS = [
  ["components/site/pricing.jsx", '"$1,497"', "Landing Page price"],
  ["components/site/pricing.jsx", '"$2,497"', "Liftoff price"],
  ["components/site/pricing.jsx", '"$3,497"', "Orbit price"],
  ["components/site/pricing.jsx", '"From $7,497"', "Beyond price"],
  ["components/site/pricing.jsx", '"From $15,000"', "Apex price"],
  ["components/site/apps.jsx", '"$4,997"', "Standard App price"],
  ["components/site/apps.jsx", '"From $9,500"', "Pro App price"],
  ["components/site/apps.jsx", '"From $300"', "App Care price"],
  ["components/site/care-plans.jsx", "monthly: 300", "Care monthly"],
  ["components/site/care-plans.jsx", "monthly: 600", "Presence monthly"],
  ["components/site/care-plans.jsx", "monthly: 1100", "Momentum monthly"],
  ["components/site/care-plans.jsx", "monthly: 1800", "Growth monthly"],
  ["components/site/care-plans.jsx", "annualMonths: 11", "Growth annual months"],
  ["components/site/filmed.jsx", '"From $3,500"', "Filmed Commercial price"],
  ["components/site/filmed.jsx", '"From $5,500"', "Production Day price"],
  ["functions/_lib/catalog.js", "amount: 249700", "catalog liftoff"],
  ["functions/_lib/catalog.js", "amount: 349700", "catalog orbit"],
  ["functions/_lib/catalog.js", "amount: 499700", "catalog standard_app"],
  ["functions/_lib/catalog.js", "amount: 30000, kind: \"plan\"", "catalog care"],
  ["functions/_lib/catalog.js", "amount: 60000, kind: \"plan\"", "catalog presence"],
  ["functions/_lib/catalog.js", "ANNUAL_MONTHS = 10", "annual = 10 months"],
];
for (const [f, s, label] of PRICE_LOCKS) mustInclude(f, s, label);
// App Care must never fall back to $200.
mustNotMatch("components/site/apps.jsx", /From \$200/, "App Care $200");
mustNotMatch(
  "components/checkout/checkout-client.jsx",
  /From \$200\/mo/,
  "App Care $200 (checkout)"
);

// ── 3) Structure locks: homepage section order + anchors ────────────────
const page = read("app/page.js");
const ORDER = [
  "<Hero />",
  "<Pain />",
  "<Burden />",
  "<Compare />",
  "<Marquee />",
  "<Services />",
  "<Work />",
  "<Why />",
  "<Process />",
  "<Founder />",
  "<CraftAi />",
  "<ForYouIf />",
  "<Apps />",
  "<Filmed />",
  "<Pricing />",
  "<Faq />",
  "<Contact />",
];
let last = -1;
for (const tag of ORDER) {
  const i = page.indexOf(tag);
  if (i === -1) failures.push(`app/page.js: locked section missing: ${tag}`);
  else if (i < last) failures.push(`app/page.js: locked section order shifted at ${tag}`);
  else last = i;
}
const ANCHORS = [
  ["components/site/pain.jsx", 'id="pain"'],
  ["components/site/burden.jsx", 'id="burden"'],
  ["components/site/services.jsx", 'id="services"'],
  ["components/site/work.jsx", 'id="work"'],
  ["components/site/apps.jsx", 'id="apps"'],
  ["components/site/filmed.jsx", 'id="filmed"'],
  ["components/site/pricing.jsx", 'id="pricing"'],
  ["components/site/pricing.jsx", 'id="plans"'],
  ["components/site/contact.jsx", 'id="contact"'],
  ["components/site/contact.jsx", 'id="brief"'],
  ["components/site/faq.jsx", 'id="faq"'],
];
for (const [f, a] of ANCHORS) mustInclude(f, a, `anchor ${a}`);

// ── 4) House rules: banned content in visitor-facing copy ────────────────
// Em/en dashes are banned in copy. Comments are allowed to keep their prose,
// so comment-only lines are stripped before the scan.
function walk(dir, out = []) {
  for (const name of readdirSync(join(root, dir))) {
    const rel = `${dir}/${name}`;
    const st = statSync(join(root, rel));
    if (st.isDirectory()) walk(rel, out);
    else if (/\.(jsx?|mjs)$/.test(name)) out.push(rel);
  }
  return out;
}
const sourceFiles = [
  ...walk("components"),
  ...walk("app"),
  ...walk("functions"),
  ...walk("lib"),
];
const BANNED_NAMES =
  /gohighlevel|highlevel|openai|chatgpt|anthropic|midjourney|zapier|make\.com|hollywood|book a call|strategy call/i;
for (const f of sourceFiles) {
  const noComments = read(f)
    // Strip block comments (this codebase writes them without leading *).
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith("//"))
    .join("\n");
  if (/[—–]/.test(noComments)) {
    failures.push(`${f}: em/en dash in non-comment source (banned in copy)`);
  }
  const banned = noComments.match(BANNED_NAMES);
  if (banned) failures.push(`${f}: banned term "${banned[0]}"`);
}
// Founder credits: only the two approved names may ever appear.
const founder = read("components/site/founder.jsx").replace(/\s+/g, " ");
if (!/Absolut Vodka commercial and an Amazon Prime series/.test(founder)) {
  failures.push("components/site/founder.jsx: locked founder credit line changed");
}

// ── 5) System locks: payment, signing, capture must stay wired ──────────
mustInclude("functions/api/checkout.js", 'ui_mode: "embedded_page"', "Stripe embedded mode");
mustInclude(
  "components/checkout/checkout-client.jsx",
  "createEmbeddedCheckoutPage",
  "Stripe client method"
);
mustInclude(
  "components/checkout/checkout-client.jsx",
  "consented",
  "consent gate state"
);
mustInclude("functions/api/sign.js", "SHA-256", "signing hash");
mustInclude("functions/api/sign.js", "CF-Connecting-IP", "signing IP capture");
mustInclude(
  "components/site/config.js",
  "bte-form-handler.sebastienriccidirector.workers.dev",
  "lead worker endpoint"
);
mustInclude("components/site/lead-form.jsx", '"beyond-the-edge"', "lead worker siteId");
mustInclude("public/_headers", "/agree/*", "signing noindex header");
mustInclude("public/_headers", "/p/*", "preview noindex header");
mustInclude(
  "public/_redirects",
  "/legal/client-services-agreement.pdf",
  "agreement PDF path"
);

// ── Result ───────────────────────────────────────────────────────────────
if (failures.length) {
  console.error("\nLOCKED INVARIANTS VIOLATED. Build blocked.\n");
  for (const f of failures) console.error("  ✗ " + f);
  console.error(
    "\nThese locks are a standing order. If this change is intended and approved, update scripts/check-invariants.mjs in the same commit.\n"
  );
  process.exit(1);
}
console.log(
  "Locked invariants OK (legal copy, prices, structure, house rules, systems)."
);
