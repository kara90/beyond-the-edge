import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";
import ButtonLink from "@/components/site/button-link";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 sm:py-44">
      {/* A final boundary glow rising from below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70vh]"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 120%, oklch(0.82 0.12 220 / 0.18) 0%, transparent 60%)",
        }}
      />
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow centered>Start your project</Eyebrow>
        </div>
        <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
          Ready to go
          <span className="text-metallic glow-edge"> beyond the edge?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
          Tell us where the brand is now and where it should be. We will show you
          what is possible, then build it.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink
            href="mailto:hello@beyondtheedgestudio.com"
            size="lg"
            className="sheen group h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
          >
            Book a call
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink
            href="#work"
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-[0.95rem] text-foreground transition-all duration-300 hover:border-edge/40 hover:bg-white/[0.06]"
          >
            See the work first
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
