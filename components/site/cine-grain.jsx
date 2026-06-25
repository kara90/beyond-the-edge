/*
  CineGrain — a fine film-grain/noise overlay to sit on top of a video so it
  reads as cinematic footage rather than a flat clip. Static SVG noise, blended
  with overlay; pointer-safe and cheap. Drop it inside a video's wrapper.
*/
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

export default function CineGrain({ className = "", opacity = 0.28 }) {
  return (
    <div
      aria-hidden="true"
      className={`cine-grain pointer-events-none absolute inset-0 motion-reduce:hidden ${className}`}
      style={{
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: NOISE,
        backgroundSize: "140px 140px",
      }}
    />
  );
}
