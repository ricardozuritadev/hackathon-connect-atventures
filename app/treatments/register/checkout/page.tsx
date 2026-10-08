import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { CheckoutScreen } from "@/components/treatments/register/checkout-screen";

export const metadata: Metadata = {
  title: "Entrega y pago",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutScreen />
    </Suspense>
  );
}
