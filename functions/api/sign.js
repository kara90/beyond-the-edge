import { AGREEMENTS, DEALS } from "../_lib/agreements-data.js";
import { makePdf, toBase64 } from "../_lib/pdf.js";

/*
  POST /api/sign
  Records acceptance of an agreement prepared at /agree/[slug].

  The server, not the client, is the source of truth: it looks up the deal
  config and agreement text by slug from the generated data module (the same
  sources the page rendered), computes a SHA-256 hash of the exact agreement
  text, and stores an immutable record: slug, deal terms, agreement versions
  and hashes, checkbox states, typed name and title, UTC timestamp, IP, and
  user agent.

  Persistence: Cloudflare KV when the SIGNATURES binding exists, plus a full
  copy emailed to the studio so an off-site record always exists. The client
  gets a confirmation email with a PDF of the signed summary and the full
  agreement(s) attached. If NO persistence path succeeds, the request fails
  honestly; we never tell a client they signed when nothing was recorded.
*/

// Which agreements each deal type requires.
const TYPE_AGREEMENTS = {
  build: ["csa"],
  plan: ["cpra"],
  "complimentary-build": ["csa", "cpra"],
};

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();

    const deal = DEALS[String(data.slug || "")];
    if (!deal) return json({ error: "Unknown agreement link." }, 404);

    if (deal.expiresAt && new Date(deal.expiresAt) < new Date()) {
      return json(
        { error: "This agreement link has expired. Email us and we will send a fresh one." },
        410
      );
    }

    const agreementIds = TYPE_AGREEMENTS[deal.agreementType] || ["csa"];

    // Required acknowledgments, all must be true.
    const checks = data.checks || {};
    const required = ["readAgree", "esign"];
    if (deal.agreementType === "complimentary-build") required.push("compTerms");
    for (const c of required) {
      if (checks[c] !== true) {
        return json({ error: "All acknowledgments must be checked." }, 400);
      }
    }

    const name = String(data.name || "").trim();
    if (!name) return json({ error: "Type your full legal name to sign." }, 400);
    const email = String(data.email || deal.email || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: "A valid email is required." }, 400);
    }

    // Hash the EXACT agreement text version(s) displayed.
    const agreementRecords = [];
    for (const id of agreementIds) {
      const a = AGREEMENTS[id];
      if (!a) return json({ error: "Agreement source missing." }, 500);
      agreementRecords.push({
        id,
        name: a.name,
        version: a.version,
        sha256: await sha256Hex(a.text),
      });
    }

    const record = {
      type: "agreement_acceptance",
      slug: deal.slug,
      deal,
      agreements: agreementRecords,
      checks: {
        readAgree: checks.readAgree === true,
        esign: checks.esign === true,
        ...(deal.agreementType === "complimentary-build"
          ? { compTerms: checks.compTerms === true }
          : {}),
      },
      signer: {
        name,
        title: String(data.title || "").trim(),
        business: String(data.business || deal.businessName || "").trim(),
        email,
      },
      signedAtUtc: new Date().toISOString(),
      ip: request.headers.get("CF-Connecting-IP") || "",
      userAgent: request.headers.get("User-Agent") || "",
    };

    // 1) Durable storage: KV if bound (unique key = immutable by convention).
    let kvOk = false;
    if (env.SIGNATURES) {
      try {
        await env.SIGNATURES.put(
          `sig:${deal.slug}:${record.signedAtUtc}`,
          JSON.stringify(record)
        );
        kvOk = true;
      } catch {}
    }

    // 2) Off-site copy: the full record to the studio inbox.
    const studioOk = await sendEmail(env, {
      to: env.NOTIFY_EMAIL || "sebastien@beyondtheedgestudio.com",
      subject: `Signed: ${deal.businessName} | ${deal.offerName}`,
      html: studioRecordHtml(record),
    });

    if (!kvOk && !studioOk) {
      return json(
        {
          error:
            "We could not record your signature right now. Nothing was saved. Please email sebastien@beyondtheedgestudio.com and we will complete it together.",
        },
        503
      );
    }

    // 3) Client confirmation with PDFs (summary + full agreements).
    const attachments = [
      {
        filename: "signed-summary.pdf",
        content: toBase64(makePdf("Signed agreement summary", summaryText(record))),
      },
      ...agreementRecords.map((a) => ({
        filename: `${a.id}-${a.version}.pdf`,
        content: toBase64(makePdf(a.name, AGREEMENTS[a.id].text)),
      })),
    ];
    await sendEmail(env, {
      to: email,
      subject: "Your signed agreement | Beyond the Edge Studio",
      html: clientConfirmHtml(record),
      attachments,
    });

    return json({ ok: true });
  } catch {
    return json({ error: "Could not process the signature. Please try again." }, 500);
  }
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendEmail(env, { to, subject, html, attachments }) {
  if (!to || !env.EMAIL_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.EMAIL_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || "Beyond the Edge Studio <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function summaryText(r) {
  const d = r.deal;
  const lines = [
    "SIGNED AGREEMENT SUMMARY",
    "",
    `Business: ${d.businessName}`,
    `Offer: ${d.offerName}`,
    `Price: $${d.price} ${d.billing === "monthly" ? "per month" : d.billing === "annual" ? "per year" : "one-time"}`,
  ];
  if (d.minimumTermMonths) lines.push(`Minimum term: ${d.minimumTermMonths} months`);
  if (d.buyoutPrice) lines.push(`Buyout price: $${d.buyoutPrice}`);
  if (d.startDate) lines.push(`Start date: ${d.startDate}`);
  if (Array.isArray(d.includes) && d.includes.length) {
    lines.push("", "Included:");
    for (const it of d.includes) lines.push(`- ${it}`);
  }
  lines.push(
    "",
    `Signed by: ${r.signer.name}${r.signer.title ? ", " + r.signer.title : ""}`,
    `Business: ${r.signer.business}`,
    `Email: ${r.signer.email}`,
    `Signed at (UTC): ${r.signedAtUtc}`,
    "",
    "Agreements signed (SHA-256 of the exact text displayed):"
  );
  for (const a of r.agreements) {
    lines.push(`- ${a.name} (${a.version}): ${a.sha256}`);
  }
  lines.push(
    "",
    "Acceptance was given by checkbox and typed signature under the E-SIGN Act and Nevada UETA."
  );
  return lines.join("\n");
}

function studioRecordHtml(r) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto">
    <h1 style="font-size:18px">Signed: ${escapeHtml(r.deal.businessName)}</h1>
    <p style="font-size:14px;color:#444">${escapeHtml(r.signer.name)} signed ${escapeHtml(
    r.deal.offerName
  )} at ${escapeHtml(r.signedAtUtc)} (IP ${escapeHtml(r.ip)}).</p>
    <p style="font-size:13px;color:#444">Full immutable record (keep this email):</p>
    <pre style="font-size:11px;background:#f6f6f6;padding:12px;border-radius:8px;white-space:pre-wrap">${escapeHtml(
      JSON.stringify(r, null, 2)
    )}</pre>
  </div>`;
}

function clientConfirmHtml(r) {
  const d = r.deal;
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;margin:auto;background:#0f1420;color:#dfe5ee;padding:28px;border-radius:14px">
    <h1 style="margin:0 0 8px;font-size:20px;color:#f4f6fa">Signed. You are all set.</h1>
    <p style="margin:0;color:#b9c2d0;font-size:14px;line-height:1.6">Hi ${escapeHtml(
      r.signer.name
    )}, your agreement for ${escapeHtml(
    d.offerName
  )} is signed and recorded. A PDF copy of the signed summary and the full agreement text is attached to this email.</p>
    <p style="margin:16px 0 0;color:#b9c2d0;font-size:14px;line-height:1.6">Signed at ${escapeHtml(
      r.signedAtUtc
    )} (UTC). Questions anytime: sebastien@beyondtheedgestudio.com</p>
  </div>`;
}

function escapeHtml(v) {
  return String(v == null ? "" : v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
