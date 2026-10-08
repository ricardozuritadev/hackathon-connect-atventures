import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { TreatmentsHomeClient } from "@/components/treatments/treatments-home-client";

export const metadata: Metadata = {
  title: "Mis tratamientos",
};

export default function TreatmentsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TreatmentsHomeClient />
    </Suspense>
  );
}
