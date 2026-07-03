import Link from "next/link";
import { BrandMark } from "@/components/site/nav";
import Footer from "@/components/site/footer";
import SignForm from "@/components/agree/sign-form";
import { getAllDeals, getDeal, getAgreementsForDeal } from "@/lib/agreements";

/*
  Private signing page for deals closed by email. Statically generated from
  data/agreements/*.json; slugs are unguessable (scaffold appends a random
  suffix). Never indexed: robots metadata here plus an X-Robots-Tag header
  from public/_headers, and excluded from the sitemap.
*/

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDeals().map((d) => ({ slug: d.slug }));
}

export const metadata = {
  title: { absolute: "Agreement | Beyond the Edge Studio" },
  robots: { index: false, follow: false },
};

const usd = (n) => "$" + Number(n).toLocaleString("en-US");

function billingLabel(deal) {
  if (deal.billing === "monthly") return `${usd(deal.price)} per month`;
  if (deal.billing === "annual") return `${usd(deal.price)} per year`;
  return `${usd(deal.price)} one-time`;
}

// Minimal markdown rendering for the agreement sources: headings, lists,
// and paragraphs. Enough for contract text, no dependency.
function renderMarkdown(text) {
  const blocks = [];
  let list = null;
  const flushList = () => {
    if (list) {
      blocks.push({ type: "ul", items: list });
      list = null;
    }
  };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      list = list || [];
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("### ")) blocks.push({ type: "h4", text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ type: "h3", text: line.slice(3) });
    else if (line.startsWith("# ")) blocks.push({ type: "h2", text: line.slice(2) });
    else blocks.push({ type: "p", text: line });
  }
  flushList();
  return blocks;
}

function AgreementText({ agreement }) {
  const blocks = renderMarkdown(agreement.text);
  return (
    <div className="max-h-[420px] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <h3 key={i} className="text-lg font-semibold text-foreground">
              {b.text}
            </h3>
          );
        if (b.type === "h3")
          return (
            <h4 key={i} className="mt-5 text-sm font-semibold text-foreground">
              {b.text}
            </h4>
          );
        if (b.type === "h4")
          return (
            <h5 key={i} className="mt-4 text-sm font-semibold text-foreground/90">
              {b.text}
            </h5>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

export default async function AgreePage({ params }) {
  const { slug } = await params;
  const deal = getDeal(slug);
  const agreements = getAgreementsForDeal(deal);
  const expired =
    deal.expiresAt && new Date(deal.expiresAt) < new Date() ? true : false;

  return (
    <>
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold">
          <BrandMark />
          <span className="font-display">
            Beyond the <span className="text-metallic">Edge</span>
          </span>
        </Link>
      </header>

      <main data-fluid-off className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-6">
        <p className="eyebrow">Agreement</p>
        <h1 className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl">
          Agreement prepared for {deal.businessName}
        </h1>

        {expired ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <p className="text-base leading-relaxed text-muted-foreground">
              This agreement link has expired. Email us and we will send a
              fresh one:{" "}
              <a
                href="mailto:sebastien@beyondtheedgestudio.com"
                className="link-underline text-edge hover:text-edge-bright"
              >
                sebastien@beyondtheedgestudio.com
              </a>
            </p>
          </div>
        ) : (
          <>
            {/* Deal summary */}
            <div className="spotlight-edge glass-clear mt-8 rounded-2xl p-6 sm:p-7">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-edge/70">
                Your deal
              </p>
              <h2 className="mt-3 text-xl font-semibold">{deal.offerName}</h2>
              <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-muted-foreground">Price</dt>
                  <dd className="font-medium text-metallic">{billingLabel(deal)}</dd>
                </div>
                {deal.minimumTermMonths ? (
                  <div className="flex justify-between gap-4 sm:block">
                    <dt className="text-muted-foreground">Minimum term</dt>
                    <dd className="font-medium">{deal.minimumTermMonths} months</dd>
                  </div>
                ) : null}
                {deal.buyoutPrice ? (
                  <div className="flex justify-between gap-4 sm:block">
                    <dt className="text-muted-foreground">Buy your site outright anytime</dt>
                    <dd className="font-medium">{usd(deal.buyoutPrice)}</dd>
                  </div>
                ) : null}
                {deal.startDate ? (
                  <div className="flex justify-between gap-4 sm:block">
                    <dt className="text-muted-foreground">Start date</dt>
                    <dd className="font-medium">{deal.startDate}</dd>
                  </div>
                ) : null}
              </dl>
              {Array.isArray(deal.includes) && deal.includes.length > 0 && (
                <>
                  <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-edge/70">
                    Included
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                    {deal.includes.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1 shrink-0 rounded-full bg-edge"
                        />
                        {it}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Full agreement text, embedded and scrollable */}
            {agreements.map((a) => (
              <section key={a.id} className="mt-8">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">{a.name}</h2>
                  <a
                    href={`/api/agreement-pdf?id=${a.id}`}
                    className="link-underline text-sm text-edge hover:text-edge-bright"
                  >
                    Download PDF
                  </a>
                </div>
                <AgreementText agreement={a} />
              </section>
            ))}

            {/* Acknowledgments + signature */}
            <SignForm
              deal={deal}
              agreementNames={agreements.map((a) => a.name)}
            />
          </>
        )}
      </main>
      <Footer quiet />
    </>
  );
}
