import { BeamsBackground } from "@/components/ui/beams-background";

/*
  BeamsLayer — the ambient light-beam aura as a drop-in atmosphere layer for the
  hero and above the background videos. Screen-blended so it adds light, and
  feathered on every edge so it blends in with no visible box.
*/
const FEATHER =
  "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)";

export default function BeamsLayer({
  intensity = "subtle",
  opacity = 0.6,
  className = "",
}) {
  return (
    <div
      aria-hidden="true"
      className={`beams-layer pointer-events-none absolute inset-0 mix-blend-screen ${className}`}
      style={{
        opacity,
        maskImage: FEATHER,
        maskComposite: "intersect",
        WebkitMaskImage: FEATHER,
        WebkitMaskComposite: "source-in",
      }}
    >
      <BeamsBackground intensity={intensity} className="h-full w-full" />
    </div>
  );
}
