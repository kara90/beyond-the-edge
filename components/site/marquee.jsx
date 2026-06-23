/*
  Marquee — a single thin, edge-faded band of capabilities that drifts past.
  Restrained on purpose: monochrome, low weight, the diamond separators in the
  boundary accent. Adds ambient motion between the hero and the content without
  competing with the signature. Pauses for reduced-motion users.
*/
const ITEMS = [
  "Cinematic web design",
  "Brand films",
  "Conversion funnels",
  "3D and motion",
  "Social content",
  "Art direction",
  "Growth systems",
];

function Row() {
  return (
    <ul className="flex shrink-0 items-center gap-10 px-5" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-10">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground/70">
            {item}
          </span>
          <span className="text-edge/50">&#9670;</span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <div className="relative border-y border-white/[0.06] py-5">
      <div
        className="flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        {/* Two identical rows make a seamless -50% loop */}
        <div className="flex animate-marquee">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
