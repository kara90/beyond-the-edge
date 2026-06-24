import { BrandMark } from "@/components/site/nav";

const NAV = [
  { href: "#services", label: "What we do" },
  { href: "#work", label: "Work" },
  { href: "#why", label: "Why us" },
  { href: "#pricing", label: "Pricing" },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/8 px-6 pt-16">
      {/* Subtle background video (~50% transparent, top edge feathered) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-50 motion-reduce:hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 28%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 28%)",
        }}
      >
        <source
          src="https://assets.cdn.filesafe.space/ddTAkxdfaM4RG7p54ZV8/media/6a3b7947967e20d627d6e338.mp4"
          type="video/mp4"
        />
      </video>
      {/* Veil so footer text stays readable over the video */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-background/40"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row">
        <div className="max-w-xs">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-base font-semibold"
          >
            <BrandMark />
            <span className="font-display">
              Beyond the <span className="text-metallic">Edge</span>
            </span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Websites and cinematic video for businesses that refuse to look
            average.
          </p>
          <a
            href="#contact"
            className="mt-5 inline-flex items-center gap-2 text-sm text-edge transition-colors hover:text-edge-bright"
          >
            <span className="size-1.5 rounded-full bg-edge shadow-[0_0_8px_var(--edge)]" />
            Booking new projects
          </a>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-4">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@beyondtheedgestudio.com"
                  className="link-underline text-muted-foreground transition-colors hover:text-foreground"
                >
                  hello@beyondtheedgestudio.com
                </a>
              </li>
              <li className="text-muted-foreground">By appointment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} Beyond the Edge Studio. All rights
          reserved.
        </p>
        <p className="font-mono tracking-wider">Beyond the edge of expected.</p>
      </div>

      {/* Oversized wordmark watermark — fades up into the void */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-8 select-none text-center"
      >
        <span className="block whitespace-nowrap bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-[19vw] font-bold leading-[0.85] tracking-tight text-transparent">
          Beyond the Edge
        </span>
      </div>
    </footer>
  );
}
