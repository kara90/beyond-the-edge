/*
  Performance tiering. "Lite" mode sheds the heavy GPU effects (WebGL fluid,
  SVG liquid distortion, beam canvases, grid reveal, the scroll-scrubbed hero)
  so the site stays smooth on weaker machines while strong machines keep the
  full experience.

  Two signals decide it:
    1. Coarse device hints checked synchronously (low core/RAM count, touch
       pointers, data-saver) — flags obvious weak/mobile devices up front.
    2. A live FPS probe (PerfGuard) that escalates to lite if the page is
       actually janking, which catches mid laptops with weak GPUs that the
       hints miss.

  Components call isLite() at startup (bail if already lite) and onLite() to
  tear down if lite is triggered later. Once lite, it stays lite (sticky).
*/

let liteState = null; // null = not yet computed
const subscribers = new Set();

export function coarseLite() {
  if (typeof navigator === "undefined") return false;
  // Manual override for testing / a fallback users can bookmark.
  if (typeof location !== "undefined" && /[?&]lite=1/.test(location.search)) {
    return true;
  }
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  const coarse =
    typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  return cores <= 4 || mem <= 4 || coarse || saveData;
}

export function isLite() {
  if (liteState === null) {
    liteState = coarseLite();
    if (liteState && typeof document !== "undefined") {
      document.documentElement.classList.add("lite");
    }
  }
  return liteState;
}

export function setLite(value) {
  if (liteState === true) return; // sticky
  liteState = !!value;
  if (liteState) {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("lite");
    }
    subscribers.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
    subscribers.clear();
  }
}

// Run fn now if already lite, otherwise when lite is triggered. Returns an
// unsubscribe.
export function onLite(fn) {
  if (isLite()) {
    fn();
    return () => {};
  }
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
