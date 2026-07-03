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
      "Beyond the Edge Studio is a creative studio offering website design and development, web application design and development, video and content production, marketing funnels and automations, hosting management, and related services. Some work is produced using a blend of human production and artificial intelligence tools, as described in Section 11.",
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
    title: "Services and governing agreements",
    body: [
      "Client work is governed by two written agreements: the Client Services Agreement, which governs project builds such as websites, apps, video, and funnels, and the Care Plan and Retainer Agreement, which governs recurring monthly and annual plans. You accept the applicable agreement by signing it, checking an acceptance box at online checkout, paying any invoice or deposit, or directing work to begin, whichever occurs first. Completing an online purchase on this Site constitutes acceptance of the applicable agreement, which is incorporated by reference into your order. Pricing shown on the Site is a starting point and is confirmed in writing or at checkout before any engagement. On-location filming and physical production are quoted per project and can exceed the starting prices shown for video on the Site. Where these Terms conflict with a signed or accepted agreement, that agreement controls for the engagement.",
    ],
  },
  {
    n: 4,
    title: "Subscriptions and automatic renewal",
    body: [
      "Care plans and other recurring plans are billed in advance and renew automatically, monthly plans each month and annual plans each year, at the then-current rate until cancelled. By purchasing a plan you authorize us and our payment processor to charge your payment method on each renewal date until you cancel. You can cancel anytime, effective at the end of the current billing period, by emailing us at the address in Section 19; no pro-rata refunds are given for a period already billed, and annual plans run through their prepaid term and then stop renewing. After purchase we send a confirmation that restates the plan, price, renewal frequency, and how to cancel. Price changes take effect at your next renewal after at least thirty days notice. A plan that includes a complimentary build may carry a minimum term, which is stated before you sign up.",
    ],
  },
  {
    n: 5,
    title: "Ownership: purchased work and complimentary work",
    body: [
      "Ownership is governed in full by the Client Services Agreement and the Care Plan and Retainer Agreement. In summary:",
      "A website, app, or other deliverable you purchase becomes yours when it is fully paid, subject to standard carve-outs for our reusable tools and frameworks (licensed to you as embedded in your deliverable), third-party assets under their own licenses, and the nature of AI-assisted elements described in Section 11.",
      "A landing page or site provided free or as part of a monthly plan (a complimentary or sponsored build) is not purchased and is not owned by you. It remains our property and is licensed to you only while the relevant plan is active and paid. If your plan has a minimum term, it is stated before signup. If payment stops, we give notice and a grace period, we may suspend the page, and if payment is not brought current we may take the page offline permanently. You can purchase your complimentary page outright at any time at the buyout price stated at signup.",
      "In every case, and regardless of any dispute: your domain name registered in your name stays yours, the logo, images, text, and data you supplied stay yours and are returned on request, and leads and customer data generated through your site belong to you and are exported to you on request.",
      "We retain the right to reuse general skills, methods, code frameworks, and non-client-specific components, and to display completed work in our portfolio unless agreed otherwise in writing.",
    ],
  },
  {
    n: 6,
    title: "Hosting",
    body: [
      "Purchased builds include six months of standard hosting after launch at no extra charge. After that, hosting continues under any care plan, as a hosting-only service at $49 per month, or you may self-host, in which case we provide one complete export of your site files at no charge. Hosting runs on third-party infrastructure; we use commercially reasonable efforts to keep sites available but do not guarantee uninterrupted or error-free operation.",
    ],
  },
  {
    n: 7,
    title: "Payment and refunds",
    body: [
      "Fees, deposits, payment schedules, and refund terms are set out in the governing agreements. Unless stated otherwise, deposits are non-refundable once work begins, project fees are earned in full at design approval, and subscription and care plans are billed in advance. If you believe a charge is incorrect, contact us before initiating a card dispute; a chargeback on properly delivered work is treated as nonpayment under the governing agreements.",
    ],
  },
  {
    n: 8,
    title: "Acceptable use of hosted services",
    body: [
      "Sites, apps, and content we build or host for you may not contain unlawful, infringing, deceptive, or malicious material. We may decline requests and, after notice where practical, remove content we reasonably believe is unlawful or infringing. You are solely responsible for the legality and accuracy of your business, products, offers, and claims. Clients are solely responsible for obtaining any consents required by law to message their own customers or contacts through systems we configure, and for honoring opt-outs.",
    ],
  },
  {
    n: 9,
    title: "Copyright complaints",
    body: [
      "If you believe content hosted through our services infringes your copyright, send a written notice to the email address in Section 19 including: your contact information, identification of the copyrighted work, the URL of the allegedly infringing material, a statement of good-faith belief that the use is unauthorized, a statement under penalty of perjury that your notice is accurate and that you are the owner or authorized to act for the owner, and your physical or electronic signature. We will review and act on valid notices, may forward them to the affected client, and may terminate hosted services for repeat infringers. Affected clients may submit a counter-notice with equivalent elements.",
    ],
  },
  {
    n: 10,
    title: "No guarantee of results",
    body: [
      "We deliver professional work to a high standard, but we do not and cannot guarantee specific business outcomes, including search engine rankings, traffic, leads, sales, revenue, or return on investment. Any examples, samples, or statements about potential results are illustrative only, are not typical, and are not promises. Search engine rankings in particular depend on factors outside our control.",
    ],
  },
  {
    n: 11,
    title: "AI and production methods",
    body: [
      "We combine real production, including real cameras, direction, and editing, with artificial intelligence tools and hand-built marketing work. The mix varies by project and deliverable, and we are transparent about the method of any deliverable on request. Because purely machine-generated elements may not qualify for copyright protection under current United States law, any transfer of ownership conveys all rights to the extent such rights exist, and we do not warrant that every element of a deliverable is registrable under copyright law.",
    ],
  },
  {
    n: 12,
    title: "Third-party services",
    body: [
      "Our services may rely on third-party providers, including domain registrars, hosting and infrastructure platforms, analytics, marketing and automation platforms, payment processors, app stores, and browsers. Your use of those services may be subject to their own terms, and we are not responsible for their acts, omissions, availability, changes, or pricing. If a technology that is material to delivering our services, including websites, landing pages, apps, funnels, automations, and AI-produced video, becomes unavailable, restricted, unlawful for us to use, or commercially impracticable to continue, and no reasonable substitute exists, we may wind down the affected services with notice and refund unused prepaid amounts as described in the governing agreements. Services that do not depend on the affected technology, including on-location filming, continue unaffected.",
    ],
  },
  {
    n: 13,
    title: "Disclaimers",
    body: [
      'The Site and our services are provided on an "as is" and "as available" basis to the fullest extent permitted by law. We do not warrant that the Site will be uninterrupted, error free, or secure. We disclaim all warranties not expressly stated in a signed or accepted agreement, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
    ],
  },
  {
    n: 14,
    title: "Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Beyond the Edge and its owner, contractors, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, data, or goodwill, arising from your use of the Site or our services. Our total liability for any claim arising from services will not exceed the amount you paid us for the specific service giving rise to the claim, and our total liability for any claim arising solely from use of the Site will not exceed one hundred dollars. Suspension or removal of a complimentary build carried out in accordance with the governing agreement is not a compensable loss.",
    ],
  },
  {
    n: 15,
    title: "Indemnification",
    body: [
      "You agree to indemnify and hold harmless Beyond the Edge and its owner, contractors, employees, and affiliates from any claims, damages, or expenses, including reasonable legal fees, arising from your content, your products or services, your use of our work, your violation of these Terms, or your violation of any law or third-party right.",
    ],
  },
  {
    n: 16,
    title: "Governing law and disputes",
    body: [
      "These Terms are governed by the laws of the State of Nevada, without regard to conflict of law rules. Any dispute will be resolved exclusively in the state or federal courts located in Clark County, Nevada, and you consent to that jurisdiction, except that either party may bring a qualifying claim in small claims court. To the extent permitted by law, you waive any right to a jury trial. Any claim arising from these Terms or our services must be brought within one year after it arises, or it is permanently barred. The prevailing party in any action to enforce these Terms is entitled to reasonable attorney fees and costs.",
    ],
  },
  {
    n: 17,
    title: "General",
    body: [
      "These Terms, together with any accepted Client Services Agreement, Care Plan and Retainer Agreement, and our Privacy Policy, are the entire agreement between you and us regarding the Site and our services. If any provision is found unenforceable, the rest remains in effect. You may not assign your rights under these Terms without our consent, and we may assign ours, including to a business entity we form, an affiliate, or a successor. Electronic acceptance, including checkout acceptance and continued use of the Site, is binding under applicable law, including the E-SIGN Act and Nevada UETA.",
    ],
  },
  {
    n: 18,
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
          Last updated: July 3, 2026
        </p>
        <p className="mt-8 text-[0.95rem] leading-relaxed text-muted-foreground">
          These Terms of Service ("Terms") govern your access to and use of the
          website at beyondtheedgestudio.com (the "Site") and any services
          provided by Sebastien Vautier, professionally known as Sebastien
          Ricci, doing business as Beyond the Edge Studio, and any successor
          entity to which these Terms are assigned ("Beyond the Edge," "we,"
          "us," or "our"). By using the Site or engaging our services, you agree
          to these Terms. If you do not agree, do not use the Site or our
          services.
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
            <h2 className="text-xl font-semibold">19. Contact</h2>
            <address className="mt-3 not-italic text-[0.95rem] leading-relaxed text-muted-foreground">
              Sebastien Vautier (professionally known as Sebastien Ricci) d/b/a
              Beyond the Edge Studio
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

      <Footer quiet />
    </>
  );
}
