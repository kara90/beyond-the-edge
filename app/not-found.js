import { BrandMark } from "@/components/site/nav";
import ButtonLink from "@/components/site/button-link";

export const metadata = {
  title: "Lost in the void",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* boundary glow rising from below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60vh]"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 120%, oklch(0.82 0.12 220 / 0.18) 0%, transparent 60%)",
        }}
      />
      <BrandMark className="size-10" />
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        Lost in the <span className="text-metallic">void.</span>
      </h1>
      <p className="mt-5 max-w-md text-muted-foreground">
        This page drifted past the edge. Let us bring you back to solid ground.
      </p>
      <ButtonLink
        href="/"
        size="lg"
        className="mt-9 h-12 rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_34px_-6px_var(--primary)]"
      >
        Back to home
      </ButtonLink>
    </main>
  );
}
