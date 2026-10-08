import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { RepurchaseScreen } from "@/components/treatments/repurchase-screen";

export const metadata: Metadata = {
  title: "Recompra",
};

async function RepurchaseDetail({
  params,
}: {
  params: Promise<{ treatmentId: string }>;
}) {
  const { treatmentId } = await params;
  return <RepurchaseScreen treatmentId={treatmentId} />;
}

export default function RepurchasePage(
  props: PageProps<"/treatments/[treatmentId]/repurchase">
) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RepurchaseDetail params={props.params} />
    </Suspense>
  );
}
