/*
  Eyebrow — a small editorial section label: a luminous hairline rule paired
  with a mono caption. Replaces decorative 01/02/03 numbering (the sections
  aren't a sequence). `centered` puts a rule on both sides for centered headers.
*/
export default function Eyebrow({ children, centered = false, className = "" }) {
  const Rule = () => (
    <span className="h-px w-8 bg-gradient-to-r from-transparent via-edge/50 to-edge/70" />
  );
  return (
    <span
      className={`inline-flex items-center gap-3 ${
        centered ? "justify-center" : ""
      } ${className}`}
    >
      <Rule />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-edge/80">
        {children}
      </span>
      {centered && (
        <span className="h-px w-8 bg-gradient-to-l from-transparent via-edge/50 to-edge/70" />
      )}
    </span>
  );
}
