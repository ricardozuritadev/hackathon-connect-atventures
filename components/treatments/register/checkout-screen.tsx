"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { StepProgress } from "@/components/treatments/step-progress";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/demo/fixtures";
import type { DeliveryMode } from "@/lib/treatments/types";
import { cn } from "@/lib/utils";

const DELIVERY_OPTIONS: {
  value: DeliveryMode;
  title: string;
  description: string;
}[] = [
  {
    value: "home_delivery",
    title: "Entrega a domicilio",
    description: "Pago online y envío a tu dirección",
  },
  {
    value: "pharmacy_pickup",
    title: "Retiro en farmacia",
    description: "Recoge tu pedido en la farmacia Medicity",
  },
  {
    value: "reserve_pay_pharmacy",
    title: "Reserva y pago en farmacia",
    description: "Reserva ahora y paga al retirar",
  },
];

export function CheckoutScreen() {
  const router = useRouter();
  const { state, hydrated, setDeliveryMode, completePurchase } =
    useTreatmentDemo();
  const [mode, setMode] = useState<DeliveryMode>("home_delivery");
  const [paying, setPaying] = useState(false);
  const pricing = state.draft.pricing;
  const primary = state.draft.confirmedMedications[0];
  const latestTreatment = state.treatments[0];

  useEffect(() => {
    if (!hydrated) return;
    if (pricing && primary) return;
    if (latestTreatment) {
      router.replace(
        `/treatments/register/confirmation?treatmentId=${latestTreatment.id}`
      );
      return;
    }
    router.replace("/treatments/register/benefits");
  }, [hydrated, pricing, primary, latestTreatment, router]);

  if (!hydrated || !pricing || !primary) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Cargando…</p>
      </AppShell>
    );
  }

  function handlePay() {
    setPaying(true);
    setDeliveryMode(mode);
    const treatment = completePurchase(mode);
    if (treatment) {
      router.replace(
        `/treatments/register/confirmation?treatmentId=${treatment.id}`
      );
      return;
    }
    setPaying(false);
    router.push("/treatments");
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <StepProgress current={5} />
        <ScreenIntro
          eyebrow="Paso 5"
          title="Entrega y pago"
          body="Elige cómo recibir tu medicamento."
        />

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Modalidad de entrega</legend>
          {DELIVERY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border px-3.5 py-3",
                mode === option.value
                  ? "border-medicity-blue bg-medicity-blue-light"
                  : "border-border-default"
              )}
            >
              <input
                type="radio"
                name="delivery"
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-medium text-text-primary">
                  {option.title}
                </span>
                <span className="block text-xs text-text-secondary">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="rounded-[var(--radius-card)] border border-border-default p-4">
          <p className="font-bold text-text-primary">Resumen de pago</p>
          <p className="mt-2 text-sm text-text-secondary">
            {primary.name} · {primary.presentation}
          </p>
          <p className="mt-2 text-base font-bold text-text-primary">
            Total a pagar (copago):{" "}
            {formatMoney(pricing.copayAmount, pricing.currencyLabel)}
          </p>
        </div>

        <Button
          type="button"
          className="w-full"
          disabled={paying}
          onClick={handlePay}
        >
          {paying ? "Procesando…" : "Confirmar y pagar"}
        </Button>
      </div>
    </AppShell>
  );
}
