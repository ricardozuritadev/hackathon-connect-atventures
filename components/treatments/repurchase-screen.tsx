"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { BenefitBadge } from "@/components/treatments/benefit-badge";
import { CopaySummary } from "@/components/treatments/copay-summary";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";

type RepurchaseScreenProps = {
  treatmentId: string;
};

export function RepurchaseScreen({ treatmentId }: RepurchaseScreenProps) {
  const router = useRouter();
  const { hydrated, getTreatment, completeRepurchase, state } =
    useTreatmentDemo();
  const treatment = getTreatment(treatmentId);
  const firstName = state.profile?.fullName?.split(" ")[0] ?? "Ana";

  useEffect(() => {
    if (hydrated && !treatment) {
      router.replace("/treatments");
    }
  }, [hydrated, treatment, router]);

  if (!hydrated || !treatment) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Cargando…</p>
      </AppShell>
    );
  }

  function handleConfirm() {
    if (!treatment) return;
    const id = treatment.id;
    completeRepurchase(id);
    router.push(`/treatments/${id}`);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <ScreenIntro
          eyebrow="Aviso de reposición"
          title="Es momento de reponer"
          body="Confirma la recompra de tu tratamiento."
        />

        <div className="rounded-[var(--radius-card)] border border-border-default p-4">
          <div className="flex items-center gap-2">
            <span
              className="flex size-5 items-center justify-center rounded-full bg-whatsapp text-[10px] text-white"
              aria-hidden
            >
              WA
            </span>
            <p className="text-sm font-medium text-text-primary">Medicity</p>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Hola, {firstName}. Tu medicamento podría terminarse en cinco días.
            Estás a una compra de avanzar en tu beneficio.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border-default p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-bold text-text-primary">
              {treatment.medicationName}
            </h2>
            <BenefitBadge label="Receta vigente" />
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {treatment.presentation} · Entrega a domicilio
          </p>
        </div>

        <section aria-labelledby="repurchase-pricing">
          <h2 id="repurchase-pricing" className="sr-only">
            Precio actualizado
          </h2>
          <CopaySummary pricing={treatment.pricing} />
        </section>

        <div className="rounded-[var(--radius-card)] border border-medicity-green/40 bg-medicity-green/10 p-4">
          <p className="font-bold text-text-primary">Promoción Mis tratamientos</p>
          <p className="mt-1 text-sm text-text-secondary">
            {treatment.promotion.label}
          </p>
        </div>

        <Button type="button" className="w-full" onClick={handleConfirm}>
          Confirmar recompra
        </Button>
      </div>
    </AppShell>
  );
}
