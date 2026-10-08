import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { ConfirmInstructions } from "@/components/treatments/register/confirm-instructions";

export const metadata: Metadata = {
  title: "Confirmar instrucciones",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmInstructions />
    </Suspense>
  );
}
