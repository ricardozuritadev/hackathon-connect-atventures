import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { TreatmentPanel } from "@/components/treatments/treatment-panel";

export const metadata: Metadata = {
  title: "Panel del tratamiento",
};

async function TreatmentDetail({
  params,
}: {
  params: Promise<{ treatmentId: string }>;
}) {
  const { treatmentId } = await params;
  return <TreatmentPanel treatmentId={treatmentId} />;
}

export default function TreatmentDetailPage(
  props: PageProps<"/treatments/[treatmentId]">
) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TreatmentDetail params={props.params} />
    </Suspense>
  );
}
