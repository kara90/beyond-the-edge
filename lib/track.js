/*
  Tiny analytics dispatcher. Fires the same event to whichever trackers are
  present on the page (GA4 via gtag, Meta pixel via fbq). Safe everywhere:
  no-ops on the server, no-ops when no tracker is loaded, and never throws,
  so a blocked or missing analytics script can never break the UI.
*/
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
  } catch {}
  try {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", event, params);
    }
  } catch {}
}
