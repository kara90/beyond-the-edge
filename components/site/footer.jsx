import { BrandMark } from "@/components/site/nav";

const NAV = [
  { href: "#services", label: "What we do" },
  { href: "#work", label: "Work" },
  { href: "#why", label: "Why us" },
  { href: "#pricing", label: "Pricing" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row">
        <div className="max-w-xs">
          <a href="#top" className="flex items-center gap-2.5 font-display text-base font-semibold">
            <BrandMark />
            Beyond the <span className="text-metallic">Edge</span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Websites and cinematic video for businesses that refuse to look
            average.
          </p>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                  className="text-muted-foreground transition-colors hover:text-foreground"
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
        <p>© {new Date().getFullYear()} Beyond the Edge Studio. All rights reserved.</p>
        <p className="font-mono tracking-wider">Beyond the edge of expected.</p>
      </div>
    </footer>
  );
}
