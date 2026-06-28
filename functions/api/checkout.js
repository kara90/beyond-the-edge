import Stripe from "stripe";
import { lineItemsFor, orderSummary } from "../_lib/catalog.js";

/*
  POST /api/checkout
  Cloudflare Pages Function (server-side, Workers runtime). Creates a Stripe
  embedded Checkout Session for the selected fixed-price offers and returns its
  client_secret. The secret key is read from the server env and never reaches
  the browser. The order and intake answers ride along as metadata, so the full
  order is recorded with the payment.
*/
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const intake = data.intake || {};

    // Required intake, validated server-side (never trust the client).
    for (const f of ["firstName", "lastName", "email", "phone"]) {
      if (!intake[f] || String(intake[f]).trim() === "") {
        return json({ error: `Missing required field: ${f}` }, 400);
      }
    }

    const line_items = lineItemsFor(data.items);
    if (line_items.length === 0) {
      return json({ error: "No valid items selected." }, 400);
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    const origin = new URL(request.url).origin;
    const metadata = {
      first_name: clip(intake.firstName, 100),
      last_name: clip(intake.lastName, 100),
      phone: clip(intake.phone, 60),
      company: clip(intake.company, 200),
      website: clip(intake.website, 300),
      hosting: clip(intake.hosting, 200),
      order: clip(orderSummary(data.items), 480),
    };

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items,
      customer_email: String(intake.email).trim(),
      metadata,
      payment_intent_data: { metadata },
      return_url: `${origin}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    return json({ clientSecret: session.client_secret });
  } catch (err) {
    // TEMP DEBUG: surface the real reason so we can diagnose, then revert.
    return json(
      {
        error: "Could not start checkout. Please try again.",
        debug: {
          message: String((err && err.message) || err),
          type: (err && err.type) || null,
          code: (err && err.code) || null,
          hasSecret: Boolean(env.STRIPE_SECRET_KEY),
          secretPrefix: env.STRIPE_SECRET_KEY
            ? String(env.STRIPE_SECRET_KEY).slice(0, 8)
            : null,
        },
      },
      500
    );
  }
}

function clip(v, n) {
  return String(v == null ? "" : v)
    .trim()
    .slice(0, n);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
