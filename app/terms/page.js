import Link from "next/link";
import { BrandMark } from "@/components/site/nav";
import Footer from "@/components/site/footer";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of beyondtheedgestudio.com and the services provided by Beyond the Edge Studio.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    n: 1,
    title: "Who we are",
    body: [
      "Beyond the Edge Studio is a creative studio offering website design and development, video and content production, marketing funnels, hosting management, and related services. Some work is produced using a blend of human production and artificial intelligence tools, as described in Section 9.",
    ],
  },
  {
    n: 2,
    title: "Use of the Site",
    body: [
      "You may use the Site for lawful purposes only. You agree not to misuse the Site, attempt to gain unauthorized access, interfere with its operation, or copy, scrape, or reproduce its content without permission. All content on the Site, including text, design, graphics, video, and code, is owned by or licensed to Beyond the Edge and is protected by intellectual property laws. Submitting information through a form on the Site does not create a confidential or client relationship and is handled under our Privacy Policy.",
    ],
  },
  {
    n: 3,
    title: "Services and separate agreement",
    body: [
      "Use of the Site does not create a client relationship. Any services we provide are governed by a separate written Client Services Agreement that you must accept before work begins. Pricing shown on the Site is a starting point and is confirmed in writing before any engagement. Where these Terms and a signed Client Services Agreement conflict, the Client Services Agreement controls for that engagement.",
    ],
  },
  {
    n: 4,
    title: "No guarantee of results",
    body: [
      "We deliver professional work to a high standard, but we do not and cannot guarantee specific business outcomes, including search engine rankings, traffic, leads, sales, revenue, or return on investment. Any examples, samples, testimonials, or statements about potential results are illustrative only, are not typical, and are not promises. Search engine rankings in particular depend on factors outside our control, including search providers and competition.",
    ],
  },
  {
    n: 5,
    title: "Intellectual property and ownership",
    body: [
      "Ownership of work we create for a client is governed by the Client Services Agreement. In summary, and subject to that agreement: work that is fully paid for transfers to the client upon receipt of full payment, while work that is provided free or as part of a subscription remains our property and is licensed only while the relevant plan is active. We retain the right to reuse general skills, methods, code frameworks, and non-client-specific components, and to display completed work in our portfolio unless agreed otherwise in writing.",
      "To be clear: a website or landing page you purchase becomes yours once it is fully paid. A landing page or site provided free or as part of a monthly plan is not purchased and is not owned by you. It remains our property, is provided only as part of your active plan, and is taken offline if the plan is cancelled or payment stops. The full terms are set out in your Client Services Agreement.",
    ],
  },
  {
    n: 6,
    title: "Payment",
    body: [
      "Fees, deposits, schedules, and refund terms are set out in the Client Services Agreement. Unless stated otherwise, deposits are non-refundable, and subscription and care plans are billed in advance.",
    ],
  },
  {
    n: 7,
    title: "Third-party services",
    body: [
      "Our services may rely on third-party providers, including domain registrars, hosting platforms, analytics, marketing platforms, and payment processors. Your use of those services may be subject to their own terms, and we are not responsible for their acts, omissions, availability, changes, or pricing.",
    ],
  },
  {
    n: 8,
    title: "Disclaimers",
    body: [
      'The Site and our services are provided on an "as is" and "as available" basis to the fullest extent permitted by law. We do not warrant that the Site will be uninterrupted, error free, or secure. We disclaim all warranties not expressly stated in a signed agreement, including implied warranties of merchantability and fitness for a particular purpose.',
    ],
  },
  {
    n: 9,
    title: "AI and production methods",
    body: [
      "We are a studio that combines real production, including real cameras, direction, and editing, with artificial intelligence tools and hand-built marketing work. The mix varies by project and deliverable. By engaging us, you acknowledge and accept that some deliverables may be produced or assisted using AI tools, and that we will be transparent about the method of any deliverable on request.",
    ],
  },
  {
    n: 10,
    title: "Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Beyond the Edge and its owner, contractors, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, data, or goodwill, arising from your use of the Site or our services. Our total liability for any claim will not exceed the amount you paid us for the specific service giving rise to the claim.",
    ],
  },
  {
    n: 11,
    title: "Indemnification",
    body: [
      "You agree to indemnify and hold harmless Beyond the Edge and its owner, contractors, employees, and affiliates from any claims, damages, or expenses, including reasonable legal fees, arising from your content, your products or services, your use of our work, your violation of these Terms, or your violation of any law or third-party right.",
    ],
  },
  {
    n: 12,
    title: "Governing law and disputes",
    body: [
      "These Terms are governed by the laws of the State of Nevada, without regard to conflict of law rules. Any dispute will be resolved exclusively in the state or federal courts located in Clark County, Nevada, and you consent to that jurisdiction. To the extent permitted by law, you waive any right to a jury trial. Any claim arising from these Terms or our services must be brought within one year after it arises, or it is permanently barred.",
    ],
  },
  {
    n: 13,
    title: "General",
    body: [
      "These Terms, together with any Client Services Agreement and our Privacy Policy, are the entire agreement between you and us regarding the Site and our services. If any provision is found unenforceable, the rest remains in effect. You may not assign your rights under these Terms without our consent, and we may assign ours, including to a business entity we form. Electronic acceptance, including continued use of the Site, is binding.",
    ],
  },
  {
    n: 14,
    title: "Changes to these Terms",
    body: [
      "We may update these Terms at any time. The updated version takes effect when posted, with the revised date shown above. Continued use of the Site or our services after changes means you accept them.",
    ],
  },
];

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: June 25, 2026
        </p>
        <p className="mt-8 text-[0.95rem] leading-relaxed text-muted-foreground">
          These Terms of Service ("Terms") govern your access to and use of the
          website at beyondtheedgestudio.com (the "Site") and any services
          provided by Sebastien Vautier, doing business as Beyond the Edge Studio
          ("Beyond the Edge," "we," "us," or "our"). By using the Site or
          engaging our services, you agree to these Terms. If you do not agree,
          do not use the Site or our services.
        </p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.n}>
              <h2 className="text-xl font-semibold">
                {s.n}. {s.title}
              </h2>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="text-xl font-semibold">15. Contact</h2>
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
