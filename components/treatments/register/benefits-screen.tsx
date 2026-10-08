"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { BenefitBadge } from "@/components/treatments/benefit-badge";
import { CopaySummary } from "@/components/treatments/copay-summary";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { StepProgress } from "@/components/treatments/step-progress";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";

export function BenefitsScreen() {
  const router = useRouter();
  const { state, hydrated } = useTreatmentDemo();
  const { pricing, promotion, confirmedMedications, insurance } = state.draft;
  const hasMedications = confirmedMedications.length > 0;

  useEffect(() => {
    if (!hydrated) return;
    if (!pricing || !hasMedications) {
      router.replace("/treatments/register/confirm");
    }
  }, [hydrated, pricing, hasMedications, router]);

  if (!hydrated || !pricing || !hasMedications) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Cargando…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <StepProgress current={4} />
        <ScreenIntro
          eyebrow="Paso 4"
          title="Precio y beneficios"
          body="Revisa el copago y la promoción antes de pagar. Son conceptos distintos."
        />

        <section aria-labelledby="covered-medications" className="flex flex-col gap-3">
          <h2
            id="covered-medications"
            className="text-sm font-bold text-text-primary"
          >
            Medicamentos de tu receta
          </h2>
          {confirmedMedications.map((medication, index) => (
            <div
              key={`${medication.name}-${index}`}
              className="rounded-[var(--radius-field)] border border-border-default px-3.5 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-text-primary">{medication.name}</p>
                  <p className="text-sm text-text-secondary">
                    {medication.presentation}
                  </p>
                </div>
                {insurance?.hasInsurance ? (
                  <BenefitBadge label="Cubierto por el seguro" />
                ) : null}
              </div>
            </div>
          ))}
        </section>

        <section aria-labelledby="insurance-pricing">
          <h2
            id="insurance-pricing"
            className="mb-2 text-sm font-bold text-text-primary"
          >
            Cobertura del seguro
          </h2>
          <CopaySummary pricing={pricing} />
          {!insurance?.hasInsurance ? (
            <p className="mt-2 text-xs text-text-secondary">
              Sin seguro: pagas el precio total.
            </p>
          ) : null}
        </section>

        {promotion?.participates ? (
          <section
            aria-labelledby="promo-block"
            className="rounded-[var(--radius-card)] border border-medicity-green/40 bg-medicity-green/10 p-4"
          >
            <h2 id="promo-block" className="font-bold text-text-primary">
              Promoción Mis tratamientos
            </h2>
            <p className="mt-1 text-sm text-text-secondary">{promotion.label}</p>
            <div className="mt-2">
              <BenefitBadge label="Beneficio PMF" />
            </div>
          </section>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={() => router.push("/treatments/register/checkout")}
        >
          Continuar con la compra
        </Button>
      </div>
    </AppShell>
  );
}
