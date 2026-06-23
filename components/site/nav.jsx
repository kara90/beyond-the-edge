"use client";

import { useEffect, useState } from "react";
import ButtonLink from "@/components/site/button-link";
import { BOOKING_URL } from "@/components/site/config";

const LINKS = [
  { href: "#services", label: "What we do" },
  { href: "#work", label: "Work" },
  { href: "#why", label: "Why us" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border border-white/10 bg-background/70 backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <BrandMark />
          <span className="font-display">
            Beyond the <span className="text-metallic">Edge</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
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

        <ButtonLink
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          className="sheen h-9 rounded-full bg-primary px-5 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_24px_-4px_var(--primary)]"
        >
          Book a call
        </ButtonLink>
      </nav>
    </header>
  );
}

/* Brand mark: a boundary ring with a single point breaking through it. */
export function BrandMark({ className = "size-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="13" r="8" stroke="var(--edge)" strokeWidth="1.5" opacity="0.7" />
      <path
        d="M12 21 L12 3"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="4" r="2" fill="var(--edge-bright)" />
    </svg>
  );
}
