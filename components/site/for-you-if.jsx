import { Check } from "lucide-react";
import Reveal from "@/components/site/reveal";
import Eyebrow from "@/components/site/eyebrow";

/*
  ForYouIf — a short, calm qualifier right before pricing, so the right buyer
  recognizes themselves before they see the numbers.
*/
const ITEMS = [
  "You are too busy to build and maintain this yourself",
  "You want it to look high-end, not like a template",
  "You do not have an in-house design, video, or marketing team",
  "You want it handled for you, not one more tool to learn",
];

export default function ForYouIf() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Reveal className="text-center">
        <div className="flex justify-center">
          <Eyebrow centered>This is for you if</Eyebrow>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <li
              key={item}
              className="spotlight-edge flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5 text-[0.95rem] leading-relaxed text-foreground/90"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-edge" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
