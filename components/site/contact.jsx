import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";
import LeadForm from "@/components/site/lead-form";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-background/65 px-6 py-32 sm:py-44">
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow centered>Start your project</Eyebrow>
        </div>
        <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
          Ready to stop losing customers to
          <span className="text-metallic glow-edge"> a better-looking competitor?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
          Tell us where the business is now and where it should be. Within one
          business day you get a straight answer on what we would build, what
          it costs, and when it ships.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/85">
          No software to learn. No equipment to buy. No team to hire. You stay
          focused on running your business, while we make it look like the best
          in the market.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <ButtonLink
            href="#brief"
            size="lg"
            data-cta-id="contact-get-scoped"
            className="sheen h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
          >
            Get my project scoped
          </ButtonLink>
          <p className="text-sm text-muted-foreground">
            Prefer email?{" "}
            <a
              href="mailto:sebastien@beyondtheedgestudio.com"
              className="link-underline text-edge"
            >
              sebastien@beyondtheedgestudio.com
            </a>
          </p>
        </div>

        {/* Soft scarcity */}
        <p className="mx-auto mt-8 max-w-md text-sm text-muted-foreground/70">
          We open a limited number of build slots each month so every project
          stays founder-led. When the month fills, new projects start the next
          one. Reach out before yours has to wait.
        </p>
      </Reveal>

      {/* Low-friction lead form */}
      <Reveal delay={0.1} className="mx-auto mt-14 max-w-4xl">
        <p className="mb-5 text-center text-sm text-muted-foreground">
          Two minutes now saves a week of back and forth. Tell us what you need
          and we reply with a plan.
        </p>
        <div id="brief" className="scroll-mt-28">
          <LeadForm />
        </div>
      </Reveal>
    </section>
  );
}
