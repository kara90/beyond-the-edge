import Link from "next/link";
import { BrandMark } from "@/components/site/nav";
import Footer from "@/components/site/footer";

export const metadata = {
  title: "Privacy Policy — Beyond the Edge Studio",
  description:
    "How Beyond the Edge Studio collects, uses, and protects information when you visit beyondtheedgestudio.com or contact us.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-semibold"
        >
          <BrandMark />
          <span className="font-display">
            Beyond the <span className="text-metallic">Edge</span>
          </span>
        </Link>
        <Link
          href="/"
          className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </header>

      <main
        data-fluid-off
        className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-10"
      >
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: June 25, 2026
        </p>
        <p className="mt-8 text-[0.95rem] leading-relaxed text-muted-foreground">
          This Privacy Policy explains how Sebastien Vautier, doing business as
          Beyond the Edge Studio ("we," "us," or "our"), collects, uses, and
          protects information when you visit beyondtheedgestudio.com (the
          "Site") or contact us.
        </p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-xl font-semibold">1. Information we collect</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We collect information you choose to give us and limited
              information collected automatically.
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/90">
              Information you give us, for example when you submit a form or
              book a call:
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
              <li>Name and business name</li>
              <li>Email address and phone number</li>
              <li>
                Details about your project or business that you choose to share
              </li>
            </ul>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/90">
              Information collected automatically when you visit the Site:
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
              <li>
                Device and browser type, general location, and pages viewed
              </li>
              <li>
                Usage data through analytics and cookies or similar technologies
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How we use information</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We use the information to:
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
              <li>Respond to your inquiries and provide quotes and services</li>
              <li>Schedule and conduct calls and manage projects</li>
              <li>Operate, secure, and improve the Site</li>
              <li>
                Send service-related communications, and, where permitted,
                occasional updates you can opt out of
              </li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How information is shared</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We share information only as needed to run our business, including
              with trusted service providers who act on our behalf, such as
              hosting, analytics, scheduling, payment processing, and marketing
              platforms. These providers may process your information under
              their own terms. We may also disclose information if required by
              law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Cookies and analytics</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              The Site may use cookies and analytics tools to understand traffic
              and improve performance. You can control cookies through your
              browser settings. Some features may not work properly if cookies
              are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data retention</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We keep personal information only as long as needed for the
              purposes described here, to provide our services, and to meet
              legal, accounting, or reporting requirements, then we delete or
              anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Your choices and rights</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              You may request to access, correct, or delete the personal
              information we hold about you, and you may opt out of non-essential
              communications at any time. Depending on where you live, you may
              have additional rights under applicable privacy laws. To make a
              request, contact us using the details below. We will respond as
              required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Security</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We use reasonable technical and organizational measures to protect
              your information. No method of transmission or storage is fully
              secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Children</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              The Site and our services are not directed to children under 18,
              and we do not knowingly collect personal information from them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Third-party links</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              The Site may link to third-party sites we do not control. We are
              not responsible for their content or privacy practices, and we
              encourage you to read their policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Changes to this policy</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. The revised
              version takes effect when posted, with the updated date shown
              above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Contact</h2>
            <address className="mt-3 not-italic text-[0.95rem] leading-relaxed text-muted-foreground">
              Sebastien Vautier d/b/a Beyond the Edge Studio
              <br />
              4375 N Las Vegas Blvd, Suite 7 PMB 5028, Las Vegas, NV 89115,
              United States
              <br />
              <a
                href="mailto:sebastien@beyondtheedgestudio.com"
                className="link-underline text-edge transition-colors hover:text-edge-bright"
              >
                sebastien@beyondtheedgestudio.com
              </a>
            </address>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
