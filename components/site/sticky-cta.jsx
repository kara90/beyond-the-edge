"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/*
  StickyCta: mobile-only bottom call to action (under 768px).
  Appears once the reader has scrolled past 60% of the hero, hides again while
  the #contact section (the form) is on screen, and can be dismissed with the
  x for the rest of the visit. Only mounted on the homepage, so it never shows
  on legal or checkout pages. Safe-area aware.
*/
export default function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    // The hero is the first section inside <main id="top">.
    const hero = document.querySelector("#top > section");
    if (!contact || !hero) return;

    const onScroll = () => {
      setPastHero(window.scrollY > hero.offsetHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Observers can batch entries on fast scrolls; the LAST entry is current.
    const contactIo = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      setContactInView(e.isIntersecting);
    });
    contactIo.observe(contact);

    return () => {
      window.removeEventListener("scroll", onScroll);
      contactIo.disconnect();
    };
  }, []);

  const visible = pastHero && !contactInView && !dismissed;

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-500 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="relative">
        <a
          href="#brief"
          className="sheen flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 pr-12 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
        >
          Claim your build slot
        </a>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-primary-foreground/70 transition-colors hover:bg-black/10 hover:text-primary-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
