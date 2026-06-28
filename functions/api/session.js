import Stripe from "stripe";

/*
  GET /api/session?session_id=cs_xxx
  Returns the status of a checkout session so the confirmation page can show the
  right state. Reads via the secret key on the server only.
*/
export async function onRequestGet(context) {
  const { request, env } = context;
  const id = new URL(request.url).searchParams.get("session_id");
  if (!id) return json({ error: "Missing session_id" }, 400);
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });
    const s = await stripe.checkout.sessions.retrieve(id);
    return json({
      status: s.status,
      payment_status: s.payment_status,
      email: (s.customer_details && s.customer_details.email) || null,
      amount_total: s.amount_total,
    });
  } catch (err) {
    return json({ error: "Not found" }, 404);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
