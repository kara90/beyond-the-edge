import { Check, ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

/*
  Filmed for real: physical production as a first-class offer. Sits between
  Apps and Pricing. Finishing and enhancement are included in every filmed
  package; enhancement is never a separate paid item anywhere on the site.
*/
const PACKAGES = [
  {
    name: "Filmed Commercial",
    price: "From $3,500",
    subtitle: "The real-camera entry point.",
    features: [
      "Half-day shoot at one location",
      "Director-operated cinema camera and lighting",
      "One finished 30 or 60 second commercial",
      "Three social cutdowns from the same shoot",
      "Full post-production and finishing included",
    ],
  },
  {
    name: "Production Day",
    price: "From $5,500",
    subtitle: "For campaigns that need scale.",
    features: [
      "Full crew day",
      "Multiple setups or locations",
      "Talent, sets, and styling coordinated",
      "A campaign's worth of footage in one day",
      "Scoped and quoted per project",
    ],
  },
];

export default function Filmed() {
  return (
    <section
      id="filmed"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:py-36"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow centered>Filmed for real</Eyebrow>
        </div>
        <h2 className="mt-6 text-3xl font-semibold leading-[1.08] sm:text-5xl">
          When only a real shoot will do,
          <span className="text-metallic"> we bring the cameras.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Most of what we make ships from the studio. Some stories need a set:
          real cinema cameras, real lighting, real direction. The founder has
          spent 22 years behind the camera on commercial productions, and the
          gear, the crew, and the eye come with the package.
        </p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 sm:grid-cols-2">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08} className="h-full">
            <article className="spotlight-edge glass-clear relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5">
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {p.name}
              </h3>
              <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-edge/70">
                {p.subtitle}
              </p>
              <p className="mt-6 flex flex-wrap items-baseline gap-2">
                <span className="font-display text-3xl font-semibold tracking-tight text-metallic">
                  {p.price}
                </span>
              </p>
              <ul className="mt-7 flex-1 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 py-3 text-sm text-foreground/90"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-edge" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground/70">
          Starting prices for the base package. Locations, studio time, talent,
          props, travel, and usage rights are scoped and quoted in writing
          before anything is booked, and confirmed by Order before you commit.
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-9 flex justify-center">
        <ButtonLink
          href="#brief"
          size="lg"
          data-cta-id="filmed-scope-shoot"
          className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
        >
          Scope my shoot
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
      </Reveal>
    </section>
  );
}
