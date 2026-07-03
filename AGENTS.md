<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LOCKED INVARIANTS (Sebastien's standing order, 2026-07-03)

Everything below is FROZEN. Do not change any of it without Sebastien's
explicit approval in the current conversation. `npm run build` runs
`scripts/check-invariants.mjs` first and FAILS the build (locally and on
Cloudflare Pages) if a lock shifts. If a change is truly approved, update
that script in the same commit. Never weaken a check just to make a build
pass.

## House rules (locked)
- No em dashes or en dashes anywhere in visitor-facing copy.
- Never name any AI tool, model, vendor, or automation platform. The only
  allowed phrasing is "our own automation infrastructure".
- Founder credits by name: ONLY an Absolut Vodka commercial and an Amazon
  Prime series. Never any other brand, client, or production.
- Never invent testimonials, client names, metrics, or results. No
  placeholder proof (no fake logos, fake quotes, "coming soon" cards).
- Never promise Google rankings. Never say "Hollywood". No "book a call"
  language anywhere: this studio closes by email only.
- Keep the visual design system (tokens, Space Grotesk, cyan edge +
  champagne metallic, grid reveal, liquid distortion, scroll-scrubbed hero)
  and the lite/reduced-motion paths working.

## Prices (locked, display AND functions/_lib/catalog.js must match)
Liftoff $2,497 · Orbit $3,497 · Beyond from $7,497 · Apex from $15,000 ·
Standard App $4,997 · Pro App from $9,500 · Care $300/mo · Presence $600/mo
(RECOMMENDED) · Growth from $1,800/mo · App Care from $300/mo (never $200) ·
annual = 10 months (Growth = 11) · standalone hosting $49/mo · extra page
$150 / advanced 3D $250 · animation module $800 · copywriting $150/page ·
logo $750 · store/booking $600 · produced brand video (studio-produced)
$1,500 · Filmed Commercial from $3,500 · Production Day (full crew) from
$5,500.

## Legal copy (locked exact strings; see check-invariants.mjs)
"Standard plans are month to month" scoping · three rounds of design
refinement · $49/mo pause hosting · page buyout line · hosting-cost FAQ ·
"Renews monthly/annually until cancelled. Cancel anytime by email." on every
plan card · the checkout consent checkbox (required, unchecked by default,
gates the Stripe embed, persists consent into order metadata) · "Deposits
are non-refundable once work begins." · form ToS/Privacy + phone-use
microcopy. The legal operator name on /terms and /privacy is from
Sebastien's own text: do not change it without his confirmation.

## Structure (locked)
Homepage section order: Hero, Pain, Burden(#burden), Compare, Marquee,
Services (4 cards + invisible-engine strip), Work (honest proof only),
Why, Process, Founder, CraftAi, ForYouIf (6 boxes), Apps (with app tiers +
App Care), Filmed(#filmed), Pricing (websites + guarantee band + add-ons
disclosure + #plans care plans + FAQ), FAQ, Contact(#brief form), Footer,
StickyCta. All anchors in that list must keep resolving.

## Systems (locked)
- Stripe checkout: `ui_mode: "embedded_page"` server-side,
  `createEmbeddedCheckoutPage` client-side, server-priced catalog, consent
  gate before the payment form. Test keys until Sebastien swaps to live.
- Signing (/agree/[slug]): server-recomputed acceptance record with SHA-256
  of the exact agreement version, KV + studio email persistence, honest 503
  when nothing can persist, PDFs from functions/_lib/pdf.js, versioned
  sources in legal/ (currently PLACEHOLDERS: never send to a client until
  attorney text lands).
- Lead form: posts JSON to the shared worker
  (bte-form-handler.sebastienriccidirector.workers.dev, siteId
  "beyond-the-edge") with the mailto fallback. Never restore a fake-success
  path.
- /p/* and /agree/* stay noindexed (metadata + public/_headers).
- /legal/*.pdf redirects to the live agreement PDF endpoint.
