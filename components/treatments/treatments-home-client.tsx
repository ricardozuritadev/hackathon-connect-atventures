"use client";

import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/medicity/app-shell";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { TreatmentListCard } from "@/components/treatments/treatment-list-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TreatmentsHomeClient() {
  const { state, hydrated } = useTreatmentDemo();
  const hasTreatments = state.treatments.length > 0;
  const firstName = state.profile?.fullName?.split(" ")[0] ?? "Andrea";

  if (!hydrated) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Cargando…</p>
      </AppShell>
    );
  }

  if (hasTreatments) {
    return (
      <AppShell>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold tracking-wide text-medicity-blue uppercase">
              Mis tratamientos
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">
              Hola, {firstName}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Consulta tus tratamientos y próximas compras.
            </p>
          </div>

          <Link
            href="/treatments/promotions"
            className="block rounded-[var(--radius-card)] bg-medicity-blue-light px-4 py-3.5"
          >
            <p className="text-[11px] font-bold tracking-wide text-medicity-blue uppercase">
              Beneficio disponible
            </p>
            <p className="mt-2 font-bold text-text-primary">
              Ahorra en tus próximas compras
            </p>
            <p className="mt-2 text-xs text-medicity-blue">
              Ver promociones y condiciones →
            </p>
          </Link>

          <section aria-labelledby="your-treatments">
            <h2 id="your-treatments" className="text-lg font-bold text-text-primary">
              Tus tratamientos
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {state.treatments.map((treatment) => (
                <li key={treatment.id}>
                  <TreatmentListCard treatment={treatment} />
                </li>
              ))}
            </ul>
          </section>

          <Link
            href="/treatments/register/profile"
            className={cn(buttonVariants({ variant: "outline" }), "w-full text-center")}
          >
            + Agregar otro tratamiento
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold leading-8 text-text-primary">
            Tus medicamentos, compras y beneficios en un solo lugar
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Registra tu tratamiento, recibe recordatorios y anticipa tu próxima
            compra.
          </p>
        </div>

        <Link
          href="/treatments/register/profile"
          className={cn(buttonVariants(), "w-full text-center")}
        >
          Registrar mi primer tratamiento
        </Link>
        <Button type="button" variant="outline" className="w-full" disabled>
          Ya tengo un tratamiento
        </Button>

        <ul className="rounded-[var(--radius-card)] border border-border-default p-4 text-sm text-text-secondary">
          <li className="flex gap-2">
            <span className="text-medicity-green" aria-hidden>
              ✓
            </span>
            Recordatorios de toma
          </li>
          <li className="mt-2 flex gap-2">
            <span className="text-medicity-green" aria-hidden>
              ✓
            </span>
            Avisos de reposición
          </li>
          <li className="mt-2 flex gap-2">
            <span className="text-medicity-green" aria-hidden>
              ✓
            </span>
            Promociones visibles
          </li>
        </ul>

        <section aria-labelledby="promos-heading">
          <h2 id="promos-heading" className="text-base font-bold text-text-primary">
            Promociones Medicity
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/treatments/promotions" className="flex flex-col gap-2">
              <div className="relative h-[73px] overflow-hidden rounded-xl">
                <Image
                  src="/medicity/promo-smartclub.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="174px"
                />
              </div>
              <p className="text-[13px] font-bold text-text-primary">
                Beneficios SmartClub
              </p>
              <p className="text-xs text-medicity-blue">Ver promociones →</p>
            </Link>
            <Link href="/treatments/promotions" className="flex flex-col gap-2">
              <div className="relative h-[73px] overflow-hidden rounded-xl">
                <Image
                  src="/medicity/promo-offers.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="174px"
                />
              </div>
              <p className="text-[13px] font-bold text-text-primary">
                Ofertas para ti
              </p>
              <p className="text-xs text-medicity-blue">Ver promociones →</p>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
