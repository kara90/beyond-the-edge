import Link from "next/link";
import { BrandMark } from "@/components/site/nav";
import Footer from "@/components/site/footer";
import CompleteClient from "@/components/checkout/complete-client";

export const metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout/complete" },
};

export default function CheckoutCompletePage() {
  return (
    <>
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold">
          <BrandMark />
          <span className="font-display">
            Beyond the <span className="text-metallic">Edge</span>
          </span>
        </Link>
      </header>
      <main data-fluid-off className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-6">
        <CompleteClient />
      </main>
      <Footer />
    </>
  );
}
