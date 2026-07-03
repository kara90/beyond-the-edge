import { Plus } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  FAQ: handles the common objections right before the closing CTA. Native
  <details> for accessibility and zero JS. Markers hidden in globals.css.
*/
const FAQS = [
  {
    q: "How long does a project take?",
    a: "Most websites ship in two to four weeks depending on scope. We give you a clear timeline before we start, and we hit it.",
  },
  {
    q: "What does the price include?",
    a: "Design, build, and launch, all custom to your brand. Each tier lists exactly what is included, and add-ons are priced openly so there are no surprises.",
  },
  {
    q: "Do you use AI?",
    a: "Yes, and we are upfront about it. We blend real production, real cameras, real editing, and hand-built funnels, with the best of AI. The AI lets us move faster and keep your cost far below a traditional agency. A real director and DP stand behind every project, so the result looks premium and converts, whether a piece is filmed or produced with AI. When a project calls for a real shoot, we shoot it. When a fast social piece makes more sense, we produce it efficiently. You always get a human directing the outcome, and major-brand quality for less.",
  },
  {
    q: "Do you work with businesses outside your area?",
    a: "Yes. We work with clients anywhere. Everything runs over email and shared previews, so location is never a barrier.",
  },
  {
    q: "How do payments work?",
    a: "Pay in full online, or email us to split larger builds: half to start, half at launch. Care plans are billed monthly, or annually with two months free.",
  },
  {
    q: "What does hosting cost after launch?",
    a: "Every build includes six months of hosting on us after launch. After that, hosting is included in any care plan, available on its own for $49 per month, or we hand you a complete export of your files if you prefer to host elsewhere. Your site is never held hostage.",
  },
  {
    q: "What does real filming cost?",
    a: "Produced video is included wherever a tier lists it. Physical production is its own world: crew, cameras, lighting, locations, studio time, props, talent, travel, and usage rights. We scope it per project and quote it in writing before anything is booked, and the range is wide by nature, because a half-day single-camera shoot and a multi-day cinematic production are different animals. Site prices are the starting point for the build; filming is quoted on top, before you commit.",
    link: { href: "#filmed", label: "See Filmed for real above for starting packages." },
  },
  {
    q: "I hate marketing and I have no time. How much of this lands on me?",
    a: "About fifteen minutes a month. You approve content before it goes out, answer the occasional question, and that is it. Everything else, the posting, the follow-up, the reviews, the updates, runs without you. That is the entire point.",
  },
  {
    q: "What if I do not like the design?",
    a: "You approve the direction before we build, and we refine it until it is right. Every build includes three rounds of design refinement, and most projects need fewer. You are never locked into something that does not feel like you.",
  },
  {
    q: "How do I know you will not disappear like my last freelancer?",
    a: "Because our model does not allow it. Your project is founder-led with one direct line, you approve the design before anything is built, you see progress throughout, and our care plans mean we are still here every month after launch. Half our business depends on staying, so we stay.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.link ? `${f.a} ${f.link.label}` : f.a,
    },
  })),
};

export default function Faq() {
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-6 py-28 sm:py-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Reveal className="text-center">
        <div className="flex justify-center">
          <Eyebrow centered>FAQ</Eyebrow>
        </div>
        <h2 className="mt-6 text-3xl font-semibold leading-[1.08] sm:text-5xl">
          Questions, answered.
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mt-14">
        <div className="divide-y divide-white/8 border-y border-white/8">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-medium">
                {f.q}
                <Plus className="size-5 shrink-0 text-edge transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                {f.a}
                {f.link && (
                  <>
                    {" "}
                    <a
                      href={f.link.href}
                      className="link-underline text-edge transition-colors hover:text-edge-bright"
                    >
                      {f.link.label}
                    </a>
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
