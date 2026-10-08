import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { BenefitsScreen } from "@/components/treatments/register/benefits-screen";

export const metadata: Metadata = {
  title: "Seguro y copago",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BenefitsScreen />
    </Suspense>
  );
}
