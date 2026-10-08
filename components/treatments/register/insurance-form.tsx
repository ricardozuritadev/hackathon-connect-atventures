"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { Field } from "@/components/treatments/field";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_PERSONA, fillEmptyString } from "@/lib/demo/persona";
import { INSURERS } from "@/lib/demo/fixtures";

export function InsuranceForm() {
  const router = useRouter();
  const { state, hydrated, setInsurance } = useTreatmentDemo();

  const [insurer, setInsurer] = useState<string>(INSURERS[0]);
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyHolder, setPolicyHolder] = useState(
    state.profile?.fullName ?? ""
  );
  const [beneficiary, setBeneficiary] = useState("self");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (state.draft.confirmedMedications.length === 0) {
      router.replace("/treatments/register/confirm");
    }
  }, [hydrated, state.draft.confirmedMedications.length, router]);

  function fillEmptyDemoFields() {
    const holderFallback =
      state.profile?.fullName || DEMO_PERSONA.profile.fullName;
    setInsurer((current) =>
      current.trim() ? current : DEMO_PERSONA.insurance.insurer
    );
    setPolicyNumber((current) =>
      fillEmptyString(current, DEMO_PERSONA.insurance.policyNumber)
    );
    setPolicyHolder((current) => fillEmptyString(current, holderFallback));
    setBeneficiary((current) =>
      current.trim() ? current : DEMO_PERSONA.insurance.beneficiary
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!policyNumber.trim() || !policyHolder.trim()) {
      setError("Completa los campos obligatorios del seguro.");
      return;
    }

    setInsurance({
      hasInsurance: true,
      insurer,
      policyNumber: policyNumber.trim(),
      policyHolder: policyHolder.trim(),
      beneficiary,
    });
    router.push("/treatments/register/benefits");
  }

  return (
    <AppShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ScreenIntro
          eyebrow="Tratamiento · Paso 3"
          title="Datos de tu seguro"
          body="Registraremos lo necesario para consultar tu cobertura."
        />

        <Field id="insurer" label="Aseguradora *">
          <select
            id="insurer"
            value={insurer}
            onChange={(e) => setInsurer(e.target.value)}
            onFocus={fillEmptyDemoFields}
            className="h-12 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3.5 text-base"
          >
            {INSURERS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>

        <Field id="policyNumber" label="Número de póliza *">
          <Input
            id="policyNumber"
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            onFocus={fillEmptyDemoFields}
            placeholder="Ingresa el número de póliza"
          />
        </Field>

        <Field id="policyHolder" label="Titular de la póliza *">
          <Input
            id="policyHolder"
            value={policyHolder}
            onChange={(e) => setPolicyHolder(e.target.value)}
            onFocus={fillEmptyDemoFields}
            placeholder="Nombre completo"
          />
        </Field>

        <Field id="beneficiary" label="Beneficiario">
          <select
            id="beneficiary"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            onFocus={fillEmptyDemoFields}
            className="h-12 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3.5 text-base"
          >
            <option value="self">Yo soy el titular</option>
            <option value="other">Otra persona</option>
          </select>
        </Field>

        <p className="text-xs text-text-secondary">
          Si el beneficiario es otra persona, solicita su autorización antes de
          continuar.
        </p>

        <div className="rounded-xl bg-muted px-3 py-3 text-xs text-text-secondary">
          Tus datos se utilizarán para consultar la cobertura de tu seguro.
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full">
          Consultar cobertura
        </Button>
      </form>
    </AppShell>
  );
}
