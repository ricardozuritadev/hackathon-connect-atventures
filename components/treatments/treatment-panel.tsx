"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { BenefitBadge } from "@/components/treatments/benefit-badge";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  formatDisplayDate,
  formatDisplayDateTime,
  formatMoney,
} from "@/lib/demo/fixtures";
import { cn } from "@/lib/utils";

type TreatmentPanelProps = {
  treatmentId: string;
};

export function TreatmentPanel({ treatmentId }: TreatmentPanelProps) {
  const router = useRouter();
  const { state, hydrated, getTreatment, confirmDose, jumpDemoDays } =
    useTreatmentDemo();
  const treatment = getTreatment(treatmentId);

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

  const firstName = state.profile?.fullName?.split(" ")[0] ?? "Ana";

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <ScreenIntro
          eyebrow="Tu tratamiento"
          title={treatment.medicationName}
          body={`${treatment.presentation} · ${treatment.instructions}`}
        />

        <section className="rounded-[var(--radius-card)] border border-border-default p-4">
          <p className="text-xs font-bold tracking-wide text-text-secondary uppercase">
            Próxima toma
          </p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {formatDisplayDateTime(treatment.nextDoseAt)}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            {treatment.medicationName}
          </p>
          {state.doseConfirmedToday ? (
            <p className="mt-3 text-sm font-medium text-medicity-green">
              Toma registrada. Próximo aviso hoy a las 20:00.
            </p>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={confirmDose}
            >
              Ya la tomé
            </Button>
          )}
        </section>

        <section className="rounded-[var(--radius-card)] border border-border-default p-4">
          <h2 className="font-bold text-text-primary">Reposición</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Fecha estimada: {formatDisplayDate(treatment.estimatedRefillDate)}
          </p>
          <div className="mt-2">
            <BenefitBadge label={treatment.promotion.label} />
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-border-default p-4">
          <h2 className="font-bold text-text-primary">Última compra</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Pedido {treatment.orderId}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Copago{" "}
            {formatMoney(
              treatment.pricing.copayAmount,
              treatment.pricing.currencyLabel
            )}
          </p>
        </section>

        <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border-default px-3.5 py-3">
          <span
            className="flex size-6 items-center justify-center rounded-full bg-whatsapp text-xs text-white"
            aria-hidden
          >
            WA
          </span>
          <p className="text-sm text-text-secondary">
            {treatment.preferences.whatsappActive
              ? `WhatsApp activo para ${firstName}`
              : "WhatsApp pendiente de activar"}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => jumpDemoDays(25)}
        >
          Salto temporal · +25 días
        </Button>

        <Link
          href={`/treatments/${treatment.id}/repurchase`}
          className={cn(buttonVariants(), "w-full text-center")}
        >
          Volver a comprar
        </Link>

        <Link
          href="/treatments"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full text-center"
          )}
        >
          Ver todos mis tratamientos
        </Link>
      </div>
    </AppShell>
  );
}
