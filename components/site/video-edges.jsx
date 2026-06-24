/*
  VideoEdges — a thin animated blue/gray line at the top and bottom of a
  full-bleed video section. Replaces a soft fade with a defined, premium edge.
  Drop inside a positioned (relative) section.
*/
export default function VideoEdges({ className = "" }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`edge-flow pointer-events-none absolute inset-x-0 top-0 z-0 h-[2px] ${className}`}
      />
      <div
        aria-hidden="true"
        className={`edge-flow pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[2px] ${className}`}
      />
    </>
  );
}
