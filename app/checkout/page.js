import Link from "next/link";
import { BrandMark } from "@/components/site/nav";
import Footer from "@/components/site/footer";
import CheckoutClient from "@/components/checkout/checkout-client";

export const metadata = {
  title: "Checkout",
  description:
    "Select your build, add what you need, and pay securely without leaving the site.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <>
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold">
          <BrandMark />
          <span className="font-display">
            Beyond the <span className="text-metallic">Edge</span>
          </span>
        </Link>
        <Link
          href="/#pricing"
          className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to pricing
        </Link>
      </header>

      <main data-fluid-off className="relative z-10 px-6 pb-24 pt-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-4 text-3xl font-semibold leading-[1.05] sm:text-4xl">
            Start your project
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            Pick your build, add what you need, and pay securely. Everything
            happens right here.
          </p>
        </div>
        <div className="mt-12">
          <CheckoutClient />
        </div>
      </main>

      <Footer />
    </>
  );
}
