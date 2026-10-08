import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { InsuranceForm } from "@/components/treatments/register/insurance-form";

export const metadata: Metadata = {
  title: "Seguro médico",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InsuranceForm />
    </Suspense>
  );
}
