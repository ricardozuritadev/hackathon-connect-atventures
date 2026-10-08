import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { ConfirmationScreen } from "@/components/treatments/register/confirmation-screen";

export const metadata: Metadata = {
  title: "Compra confirmada",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmationScreen />
    </Suspense>
  );
}
