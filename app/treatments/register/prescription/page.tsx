import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { PrescriptionUploadFlow } from "@/components/treatments/register/prescription-upload-flow";

export const metadata: Metadata = {
  title: "Cargar receta",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PrescriptionUploadFlow />
    </Suspense>
  );
}
