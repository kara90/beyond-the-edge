import Stripe from "stripe";

/*
  POST /api/stripe-webhook
  Stripe calls this when events happen. We verify the signature with the
  webhook secret (async / SubtleCrypto, required in the Workers runtime) before
  trusting anything. On a completed, paid checkout we send two emails:
    1) a branded confirmation + onboarding email to the customer
    2) a full-order notification to the studio
  Stripe also records everything in the Dashboard automatically.
*/
export async function onRequestPost(context) {
  const { request, env } = context;
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;
    const paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required" ||
      session.status === "complete";
    if (paid) {
      try {
        await fulfill(stripe, env, session);
      } catch (e) {
        // Don't fail the webhook on an email hiccup; the payment is already
        // recorded in Stripe. Return 200 so Stripe doesn't retry endlessly.
      }
    }
  }

  return new Response("ok", { status: 200 });
}

async function fulfill(stripe, env, session) {
  const li = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 50,
  });
  const itemsText = li.data
    .map((x) => `${x.quantity} x ${x.description} (${money(x.amount_total)})`)
    .join("\n");
  const itemsHtml = li.data
    .map(
      (x) =>
        `<li>${x.quantity} &times; ${escapeHtml(x.description)} <span style="color:#9aa">${money(
          x.amount_total
        )}</span></li>`
    )
    .join("");

  const m = session.metadata || {};
  const cust = session.customer_details || {};
  const total = money(session.amount_total);
  const customerEmail = cust.email || null;
  const isSub = session.mode === "subscription";

  // 1) Customer confirmation + onboarding
  await sendEmail(env, {
    to: customerEmail,
    subject: "Your project is booked — Beyond the Edge Studio",
    html: customerEmailHtml({
      name: m.first_name || cust.name || "there",
      itemsHtml,
      total,
      isSub,
    }),
  });

  // 2) Studio notification with the full order
  await sendEmail(env, {
    to: env.NOTIFY_EMAIL,
    subject: `New order: ${m.first_name || ""} ${m.last_name || ""} — ${total}`.trim(),
    html: ownerEmailHtml({ m, cust, itemsHtml, total, isSub }),
  });
}

async function sendEmail(env, { to, subject, html }) {
  if (!to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from:
        env.EMAIL_FROM ||
        "Beyond the Edge Studio <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
}

function customerEmailHtml({ name, itemsHtml, total, isSub }) {
  const recurringNote = isSub
    ? `<p style="margin:16px 0 0;color:#b9c2d0;font-size:14px;line-height:1.6">This is a recurring plan. We bill your card automatically each cycle until you cancel. Annual plans are prepaid and non-refundable except where we fail to deliver. You can cancel anytime by replying to this email.</p>`
    : "";
  return shell(`
    <h1 style="margin:0 0 8px;font-size:22px;color:#f4f6fa">You are in. Welcome aboard.</h1>
    <p style="margin:0;color:#b9c2d0;font-size:15px;line-height:1.6">Hi ${escapeHtml(
      name
    )}, thank you. Your order is confirmed and our team has it.</p>
    <div style="margin:22px 0;padding:18px;border:1px solid #1d2433;border-radius:12px;background:#0d1320">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5cc4e6">Your order</p>
      <ul style="margin:0;padding-left:18px;color:#dfe5ee;font-size:14px;line-height:1.8">${itemsHtml}</ul>
      <p style="margin:14px 0 0;font-size:15px;color:#f4f6fa"><strong>Total: ${total}</strong></p>
    </div>
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5cc4e6">What happens next</p>
    <p style="margin:0;color:#b9c2d0;font-size:14px;line-height:1.6">We reach out within one business day to kick things off and gather anything we still need. If anything is urgent, just reply to this email.</p>
    ${recurringNote}
    <p style="margin:22px 0 0;color:#7d8597;font-size:13px">Reach us anytime at hello@beyondtheedgestudio.com</p>
  `);
}

function ownerEmailHtml({ m, cust, itemsHtml, total, isSub }) {
  const row = (label, val) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#7d8597;font-size:13px;white-space:nowrap">${label}</td><td style="padding:4px 0;color:#dfe5ee;font-size:13px">${escapeHtml(
      val || "—"
    )}</td></tr>`;
  return shell(`
    <h1 style="margin:0 0 8px;font-size:20px;color:#f4f6fa">New ${
      isSub ? "subscription" : "order"
    } — ${total}</h1>
    <div style="margin:18px 0;padding:18px;border:1px solid #1d2433;border-radius:12px;background:#0d1320">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5cc4e6">Items</p>
      <ul style="margin:0;padding-left:18px;color:#dfe5ee;font-size:14px;line-height:1.8">${itemsHtml}</ul>
      <p style="margin:14px 0 0;font-size:15px;color:#f4f6fa"><strong>Total: ${total}</strong></p>
    </div>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5cc4e6">Client</p>
    <table style="border-collapse:collapse">
      ${row("Name", `${m.first_name || ""} ${m.last_name || ""}`.trim())}
      ${row("Email", (cust && cust.email) || "")}
      ${row("Phone", m.phone || (cust && cust.phone) || "")}
      ${row("Company", m.company)}
      ${row("Website", m.website)}
      ${row("Hosting", m.hosting)}
    </table>
  `);
}

function shell(inner) {
  return `<div style="margin:0;padding:28px;background:#0a0e17;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:28px;background:#0b101b;border:1px solid #1a2030;border-radius:16px">
      <p style="margin:0 0 20px;font-size:16px;font-weight:600;color:#f4f6fa">Beyond the <span style="color:#e6c99a">Edge</span></p>
      ${inner}
    </div>
  </div>`;
}

function money(cents) {
  if (cents == null) return "$0";
  return "$" + (cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
