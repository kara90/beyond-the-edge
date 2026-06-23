import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
  ButtonLink — an anchor styled with the shared button variants.
  This template's Button is Base UI (no `asChild`), so for links we render a
  real <a> and borrow the variant classes. Keeps semantics and SEO correct.
*/
export default function ButtonLink({
  href,
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) {
  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </a>
  );
}
