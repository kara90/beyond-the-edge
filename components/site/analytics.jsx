"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/*
  Analytics layer. Renders nothing; wires three things on mount:
    1) GA4 loader, guarded behind a placeholder check so nothing loads (and
       track() keeps no-oping) until the real measurement ID is dropped in.
    2) First-touch UTM capture into sessionStorage ("bte_utm"), so the lead
       form and checkout can attribute the visit to its source.
    3) One document-level click listener that reports any element carrying a
       data-cta-id attribute as a cta_click event.
*/

// TODO(Sebastien): replace with the real GA4 measurement ID
const GA_ID = "G-XXXXXXXXXX";

const UTM_KEY = "bte_utm";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

export default function Analytics() {
  // 1) GA4: skip loading entirely while the ID is still the placeholder.
  //    Swapping in a real ID turns the whole pipeline on; nothing else changes.
  useEffect(() => {
    if (GA_ID.includes("XXXX")) return;
    if (document.getElementById("bte-ga4")) return;
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { anonymize_ip: true });
      const s = document.createElement("script");
      s.id = "bte-ga4";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    } catch {}
  }, []);

  // 2) UTM capture: first touch wins; never overwrite an existing record.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(UTM_KEY)) return;
      const params = new URLSearchParams(window.location.search);
      const utm = {};
      let found = false;
      for (const f of UTM_FIELDS) {
        const v = params.get(f);
        if (v) {
          utm[f] = v;
          found = true;
        }
      }
      if (found) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    } catch {}
  }, []);

  // 3) Global CTA listener: any click on (or inside) a [data-cta-id] element
  //    reports a cta_click with that id.
  useEffect(() => {
    const onClick = (e) => {
      try {
        const el =
          e.target instanceof Element
            ? e.target.closest("[data-cta-id]")
            : null;
        if (el) track("cta_click", { cta_id: el.getAttribute("data-cta-id") });
      } catch {}
    };
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
