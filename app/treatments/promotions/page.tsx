import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { PromotionsClient } from "@/components/treatments/promotions-client";

export const metadata: Metadata = {
  title: "Promociones",
};

export default function PromotionsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PromotionsClient />
    </Suspense>
  );
}
