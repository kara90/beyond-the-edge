"use client";

import { useEffect, useState } from "react";

/*
  StickyCta: mobile-only bottom call to action. Appears once the reader has
  scrolled past the #pain section (they are warmed up), hides again while the
  #contact form is on screen (no duplicate ask). Kept on in lite mode too: two
  IntersectionObservers and one fixed element cost nothing.
*/
export default function StickyCta() {
  const [pastPain, setPastPain] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const pain = document.getElementById("pain");
    const contact = document.getElementById("contact");
    if (!pain || !contact) return;

    // Observers can batch entries on fast scrolls; the LAST entry is current.
    const painIo = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      // Past = the section's top has scrolled above the viewport.
      setPastPain(e.boundingClientRect.top < 0);
    });
    painIo.observe(pain);

    const contactIo = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      setContactInView(e.isIntersecting);
    });
    contactIo.observe(contact);

    return () => {
      painIo.disconnect();
      contactIo.disconnect();
    };
  }, []);

  const visible = pastPain && !contactInView;

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-500 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a
        href="#contact"
        className="sheen flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      >
        Start your project
      </a>
    </div>
  );
}
