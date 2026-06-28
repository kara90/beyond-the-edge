"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

export default function CompleteClient() {
  const [s, setS] = useState({ loading: true });

  useEffect(() => {
    let id = null;
    try {
      id = new URLSearchParams(window.location.search).get("session_id");
    } catch {}
    if (!id) {
      setS({ loading: false, error: true });
      return;
    }
    fetch(`/api/session?session_id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => setS({ loading: false, ...d }))
      .catch(() => setS({ loading: false, error: true }));
  }, []);

  if (s.loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-edge" />
        <p className="text-sm">Confirming your payment...</p>
      </div>
    );
  }

  const paid = s.status === "complete" || s.payment_status === "paid";

  if (paid) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-edge/40 bg-edge/10 text-edge">
          <Check className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">You are in.</h1>
        <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          Payment confirmed and your order is with us. We sent a confirmation
          {s.email ? ` to ${s.email}` : ""} and will reach out within one
          business day to kick things off.
        </p>
        <Link
          href="/"
          className="sheen mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <h1 className="text-2xl font-semibold sm:text-3xl">
        {s.payment_status === "processing"
          ? "Your payment is processing"
          : "We could not confirm this payment"}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        {s.payment_status === "processing"
          ? "This can take a moment. You will get a confirmation email as soon as it clears."
          : "If you were charged, you will still receive a confirmation email. If anything looks off, reach us at sebastien@beyondtheedgestudio.com."}
      </p>
      <Link
        href="/#pricing"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm text-foreground hover:bg-white/[0.06]"
      >
        Back to pricing
      </Link>
    </div>
  );
}
