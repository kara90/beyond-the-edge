import Link from "next/link";
import { BrandMark } from "@/components/site/nav";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";
import Footer from "@/components/site/footer";
import { getAllPreviews, getPreview } from "@/lib/previews";

/*
  Private prospect preview: /p/<slug>. Each JSON in data/previews becomes a
  statically exported page at build time. These pages are never linked from
  the site, excluded from the sitemap, and marked noindex here plus via an
  X-Robots-Tag header in public/_headers.
*/

// Pre-render one page per JSON file; anything else 404s at build time.
export async function generateStaticParams() {
  return getAllPreviews().map((preview) => ({ slug: preview.slug }));
}
export const dynamicParams = false;

export const metadata = {
  // `absolute` opts out of the layout title template so the exact string ships.
  title: { absolute: "Concept preview | Beyond the Edge Studio" },
  robots: { index: false, follow: false },
};

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

function ExpiredNotice() {
  return (
    <div className="glass-clear rounded-2xl p-8 sm:p-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">
        This preview has expired.
      </h1>
      <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        Concept previews are shared for a limited window. If you would like
        another look, we are one email away.
      </p>
      <div className="mt-8">
        <ButtonLink href="mailto:sebastien@beyondtheedgestudio.com">
          Contact the studio
        </ButtonLink>
      </div>
    </div>
  );
}

export default async function PreviewPage({ params }) {
  const { slug } = await params;
  const preview = getPreview(slug);
  const expiredAtBuild = isExpired(preview.expiresAt);

  // Static exports outlive build time, so when an expiry date exists and has
  // not passed yet, ship both states plus a tiny script that swaps to the
  // expired message the moment a visitor loads the page past the deadline.
  const needsRuntimeCheck = Boolean(preview.expiresAt) && !expiredAtBuild;
  const runtimeCheck = needsRuntimeCheck
    ? `(function () {
        var expires = new Date(${JSON.stringify(preview.expiresAt)});
        if (isNaN(expires.getTime()) || expires.getTime() >= Date.now()) return;
        var live = document.getElementById("preview-live");
        var expired = document.getElementById("preview-expired");
        if (live) live.hidden = true;
        if (expired) expired.hidden = false;
      })();`
    : null;

  return (
    <>
      {/* Slim top badge bar */}
      <div className="relative z-10 border-b border-white/8 bg-background/60 px-6 py-3">
        <p className="mx-auto max-w-4xl text-center font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          Concept preview prepared for{" "}
          <span className="text-edge">{preview.name}</span> by Beyond the Edge
          Studio.
        </p>
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-semibold"
        >
          <BrandMark />
          <span className="font-display">
            Beyond the <span className="text-metallic">Edge</span>
          </span>
        </Link>
        {preview.logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={preview.logo}
            alt={`${preview.name} logo`}
            className="h-8 w-auto opacity-90"
          />
        ) : null}
      </header>

      <main
        data-fluid-off
        className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-10"
      >
        {expiredAtBuild ? (
          <ExpiredNotice />
        ) : (
          <>
            <div id="preview-live">
              <Eyebrow>Private concept</Eyebrow>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                {preview.heroLine}
              </h1>

              <div className="mt-14 space-y-6">
                {preview.sections.map((section) => (
                  <section
                    key={section.title}
                    className="glass-clear rounded-2xl p-7 sm:p-9"
                  >
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-12">
                <ButtonLink href={preview.cta.href} className="sheen">
                  {preview.cta.label}
                </ButtonLink>
              </div>
            </div>

            {needsRuntimeCheck ? (
              <>
                <div id="preview-expired" hidden>
                  <ExpiredNotice />
                </div>
                <script dangerouslySetInnerHTML={{ __html: runtimeCheck }} />
              </>
            ) : null}
          </>
        )}
      </main>

      <Footer quiet />
    </>
  );
}
