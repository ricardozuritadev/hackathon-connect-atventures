"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { Field } from "@/components/treatments/field";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { StepProgress } from "@/components/treatments/step-progress";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_PERSONA, fillEmptyString } from "@/lib/demo/persona";
import type { PatientFor } from "@/lib/treatments/types";
import { cn } from "@/lib/utils";

export function ProfileForm() {
  const router = useRouter();
  const { state, setProfile } = useTreatmentDemo();
  const existing = state.profile ?? state.draft.profile;

  const [patientFor, setPatientFor] = useState<PatientFor>(
    existing?.patientFor ?? "self"
  );
  const [fullName, setFullName] = useState(existing?.fullName ?? "");
  const [documentId, setDocumentId] = useState(existing?.documentId ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [birthDate, setBirthDate] = useState(existing?.birthDate ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function fillEmptyDemoFields() {
    setFullName((current) =>
      fillEmptyString(current, DEMO_PERSONA.profile.fullName)
    );
    setDocumentId((current) =>
      fillEmptyString(current, DEMO_PERSONA.profile.documentId)
    );
    setPhone((current) =>
      fillEmptyString(current, DEMO_PERSONA.profile.phone)
    );
    setBirthDate((current) =>
      fillEmptyString(current, DEMO_PERSONA.profile.birthDate)
    );
    setPatientFor((current) => current || DEMO_PERSONA.profile.patientFor);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Ingresa tu nombre completo.";
    if (!documentId.trim()) next.documentId = "Ingresa tu documento.";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) {
      next.phone = "Ingresa un teléfono válido con WhatsApp.";
    }
    if (!birthDate) next.birthDate = "Ingresa tu fecha de nacimiento.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setProfile({
      fullName: fullName.trim(),
      documentId: documentId.trim(),
      phone: phone.trim(),
      birthDate,
      patientFor,
    });
    router.push("/treatments/register/prescription");
  }

  return (
    <AppShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <StepProgress current={1} />
        <ScreenIntro
          eyebrow="Paso 1"
          title="Cuéntanos sobre ti"
          body="Crearemos tu perfil mínimo para registrar el tratamiento."
        />

        <div
          className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-field)] border border-border-default"
          role="group"
          aria-label="¿Para quién es este tratamiento?"
        >
          {(
            [
              { value: "self", label: "Para mí" },
              { value: "family", label: "Para un familiar" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "h-11 text-sm font-medium",
                patientFor === option.value
                  ? "bg-medicity-blue text-white"
                  : "bg-white text-text-secondary"
              )}
              aria-pressed={patientFor === option.value}
              onClick={() => {
                if (option.value === "family") return;
                setPatientFor(option.value);
              }}
              disabled={option.value === "family"}
              title={
                option.value === "family" ? "Próximamente" : undefined
              }
            >
              {option.label}
            </button>
          ))}
        </div>

        <Field id="fullName" label="Nombre completo" error={errors.fullName}>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onFocus={fillEmptyDemoFields}
            autoComplete="name"
            placeholder="Ana Pérez"
          />
        </Field>

        <Field id="documentId" label="Documento" error={errors.documentId}>
          <Input
            id="documentId"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            onFocus={fillEmptyDemoFields}
            placeholder="Número de cédula"
          />
        </Field>

        <Field id="phone" label="Teléfono con WhatsApp" error={errors.phone}>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={fillEmptyDemoFields}
            autoComplete="tel"
            placeholder="09xxxxxxxx"
          />
        </Field>

        <Field
          id="birthDate"
          label="Fecha de nacimiento"
          error={errors.birthDate}
        >
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            onFocus={fillEmptyDemoFields}
          />
        </Field>

        <Button type="submit" className="w-full">
          Continuar
        </Button>
      </form>
    </AppShell>
  );
}
