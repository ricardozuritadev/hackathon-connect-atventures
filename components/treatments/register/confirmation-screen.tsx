"use client";

import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { PreferenceRow } from "@/components/treatments/preference-row";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";
import { formatDisplayDate, formatMoney } from "@/lib/demo/fixtures";

const FINALIZE_DELAY_MS = 15_000;

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, hydrated, resetDraft } = useTreatmentDemo();
  const treatmentId = searchParams.get("treatmentId");
  const draftClearedRef = useRef(false);
  const finalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const treatment = useMemo(() => {
    if (treatmentId) {
      return state.treatments.find((item) => item.id === treatmentId);
    }
    return state.treatments[0];
  }, [state.treatments, treatmentId]);

  const [doseReminders, setDoseReminders] = useState(true);
  const [refillReminders, setRefillReminders] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!treatment) {
      router.replace("/treatments");
      return;
    }
    if (!draftClearedRef.current) {
      draftClearedRef.current = true;
      resetDraft();
    }
  }, [hydrated, treatment, router, resetDraft]);

  useEffect(() => {
    return () => {
      if (finalizeTimerRef.current) {
        clearTimeout(finalizeTimerRef.current);
        finalizeTimerRef.current = null;
      }
    };
  }, []);

  if (!hydrated || !treatment) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Cargando…</p>
      </AppShell>
    );
  }

  function handleFinalize() {
    if (!treatment || finishing) return;

    setFinishing(true);
    const id = treatment.id;

    if (finalizeTimerRef.current) {
      clearTimeout(finalizeTimerRef.current);
    }

    finalizeTimerRef.current = setTimeout(() => {
      finalizeTimerRef.current = null;
      router.replace(`/treatments/${id}/whatsapp`);
    }, FINALIZE_DELAY_MS);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-[72px] items-center justify-center rounded-full bg-medicity-green/20">
            <Check className="size-8 text-medicity-green" aria-hidden />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">
            Compra confirmada
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Tu tratamiento ya se encuentra registrado en Mis tratamientos.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border-default p-4 text-left">
          <p className="font-bold text-text-primary">
            Pedido {treatment.orderId}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Entrega a domicilio · Reposición estimada{" "}
            {formatDisplayDate(treatment.estimatedRefillDate)}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Copago{" "}
            {formatMoney(
              treatment.pricing.copayAmount,
              treatment.pricing.currencyLabel
            )}
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-text-primary">
            Recordatorios por WhatsApp
          </h2>
          <p className="text-sm text-text-secondary">
            Elige qué avisos deseas recibir. Puedes modificarlos o desactivarlos
            después. Los recordatorios no sustituyen la indicación médica.
          </p>

          <PreferenceRow
            id="pref-dose"
            title="Recordatorios de toma"
            description="Hoy a las 08:00 y 20:00"
            checked={doseReminders}
            onChange={setDoseReminders}
          />
          <PreferenceRow
            id="pref-refill"
            title="Aviso de reposición"
            description="5 días antes de que se termine"
            checked={refillReminders}
            onChange={setRefillReminders}
          />
          <PreferenceRow
            id="pref-promo"
            title="Promociones y beneficios"
            description={treatment.promotion.label}
            checked={promotions}
            onChange={setPromotions}
          />

          <Button
            type="button"
            variant="whatsapp"
            className="w-full"
            disabled={finishing}
            onClick={handleFinalize}
          >
            Finalizar
          </Button>
          <p className="text-center text-xs text-text-secondary">
            Los recordatorios se enviarán a las categorías seleccionadas en el
            número registrado.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

export function ConfirmationScreen() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <p className="text-sm text-text-secondary">Cargando…</p>
        </AppShell>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
