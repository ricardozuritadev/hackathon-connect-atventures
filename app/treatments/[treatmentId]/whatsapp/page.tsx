import type { Metadata } from "next";
import { Suspense } from "react";

import { WhatsAppSimScreen } from "@/components/treatments/whatsapp-sim-screen";

export const metadata: Metadata = {
  title: "Recordatorio WhatsApp",
};

function WhatsAppLoading() {
  return (
    <div className="flex h-dvh max-h-dvh items-center justify-center bg-[#0b141a] text-sm text-white/70">
      Cargando…
    </div>
  );
}

async function WhatsAppDetail({
  params,
}: {
  params: Promise<{ treatmentId: string }>;
}) {
  const { treatmentId } = await params;
  return <WhatsAppSimScreen treatmentId={treatmentId} />;
}

export default function WhatsAppSimPage(
  props: PageProps<"/treatments/[treatmentId]/whatsapp">
) {
  return (
    <Suspense fallback={<WhatsAppLoading />}>
      <WhatsAppDetail params={props.params} />
    </Suspense>
  );
}
