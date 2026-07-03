"use client";

import { useEffect, useState } from "react";
import ButtonLink from "@/components/site/button-link";

const LINKS = [
  { href: "#services", label: "What we do" },
  { href: "#work", label: "Work" },
  { href: "#why", label: "Why us" },
  { href: "#apps", label: "Apps" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-6xl">
        <nav
          aria-label="Primary"
          className={`flex w-full items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
            scrolled || open
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

          <div className="flex items-center gap-1">
            <ButtonLink
              href="#contact"
              size="sm"
              className="sheen hidden h-9 rounded-full bg-primary px-5 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_24px_-4px_var(--primary)] md:inline-flex"
            >
              Start your project
            </ButtonLink>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="-mr-2 flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/5 md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    d="M6 6 L18 18 M18 6 L6 18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7.5 L20 7.5 M4 12 L20 12 M4 16.5 L20 16.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-background/85 p-3 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-4 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="sheen mt-2 flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start your project
            </a>
          </div>
        )}
      </div>
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
