"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { BenefitBadge } from "@/components/treatments/benefit-badge";
import { ConfirmDialog } from "@/components/treatments/confirm-dialog";
import { Field } from "@/components/treatments/field";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { StepProgress } from "@/components/treatments/step-progress";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  extractionSeedKey,
  pendingFields,
  summarizeValidationErrors,
  toConfirmedMedication,
  validateConfirmedMedications,
  type MedicationValidationError,
} from "@/lib/treatments/confirm-medications";
import type { ConfirmedMedication } from "@/lib/treatments/types";

function todayIsoDate(): string {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function fieldError(
  errors: MedicationValidationError[],
  index: number,
  field: MedicationValidationError["field"]
): string | undefined {
  return errors.find(
    (error) => error.medicationIndex === index && error.field === field
  )?.message;
}

export function ConfirmInstructions() {
  const router = useRouter();
  const { state, hydrated, setConfirmedInstructions, setInsurance } =
    useTreatmentDemo();
  const extraction = state.draft.extraction;

  const mappedMeds = useMemo(() => {
    if (!extraction?.medications.length) return [];
    return extraction.medications.map(toConfirmedMedication);
  }, [extraction]);

  const nextSeed = useMemo(() => {
    if (!extraction) return "";
    return extractionSeedKey(
      extraction.medications,
      extraction.prescriptionDate
    );
  }, [extraction]);

  const [medications, setMedications] = useState<ConfirmedMedication[]>([]);
  const [seededFrom, setSeededFrom] = useState("");
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MedicationValidationError[]>(
    []
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  if (
    hydrated &&
    extraction &&
    nextSeed &&
    nextSeed !== seededFrom &&
    (!hasLocalEdits || medications.length === 0)
  ) {
    setMedications(mappedMeds);
    setSeededFrom(nextSeed);
    setHasLocalEdits(false);
  }

  useEffect(() => {
    if (!hydrated) return;
    if (!extraction) {
      router.replace("/treatments/register/prescription");
    }
  }, [hydrated, extraction, router]);

  if (!hydrated || !extraction) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Cargando…</p>
      </AppShell>
    );
  }

  function updateMedication(
    index: number,
    field: keyof ConfirmedMedication,
    value: string
  ) {
    setHasLocalEdits(true);
    setMedications((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
    if (field === "name" || field === "dosage" || field === "frequency") {
      setFieldErrors((prev) =>
        prev.filter(
          (error) =>
            !(error.medicationIndex === index && error.field === field)
        )
      );
    }
  }

  function handleContinue() {
    setFormError(null);

    if (
      !extraction ||
      extraction.status === "unreadable" ||
      medications.length === 0
    ) {
      setFormError(
        "No pudimos leer la receta con suficiente claridad. Vuelve a cargar una imagen más nítida."
      );
      return;
    }

    const errors = validateConfirmedMedications(medications);
    if (errors.length > 0) {
      setFieldErrors(errors);
      setEditingIndex(errors[0].medicationIndex);
      setFormError(summarizeValidationErrors(errors));
      setShowReviewModal(false);
      return;
    }

    setFieldErrors([]);
    setShowReviewModal(true);
  }

  function handleReviewConfirmed() {
    const resolvedStartDate = startDate || todayIsoDate();
    if (!startDate) {
      setStartDate(resolvedStartDate);
    }
    setConfirmedInstructions(medications, resolvedStartDate);
    setShowReviewModal(false);
    setShowInsuranceModal(true);
  }

  function handleHasInsurance(hasInsurance: boolean) {
    setShowInsuranceModal(false);
    if (hasInsurance) {
      router.push("/treatments/register/insurance");
      return;
    }
    setInsurance({ hasInsurance: false });
    router.push("/treatments/register/benefits");
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <StepProgress current={3} />
        <ScreenIntro
          eyebrow="Paso 3"
          title="Confirma las instrucciones"
          body="Revisa que la información coincida con la receta antes de continuar."
        />

        {extraction.warnings.length > 0 ? (
          <ul className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {extraction.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}

        {medications.map((medication, index) => {
          const pending = pendingFields(medication);
          return (
            <article
              key={`${medication.name}-${index}`}
              className="rounded-[var(--radius-card)] border border-border-default p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <BenefitBadge
                  label={
                    extraction.status === "partial" ? "Revisar" : "Propuesto"
                  }
                />
                <button
                  type="button"
                  className="rounded-lg p-1 text-medicity-blue hover:bg-medicity-blue-light"
                  aria-label={`Editar ${medication.name}`}
                  onClick={() =>
                    setEditingIndex(editingIndex === index ? null : index)
                  }
                >
                  <Pencil className="size-5" />
                </button>
              </div>

              {editingIndex === index ? (
                <div className="mt-3 flex flex-col gap-3">
                  <Field
                    id={`name-${index}`}
                    label="Medicamento"
                    error={fieldError(fieldErrors, index, "name")}
                  >
                    <Input
                      id={`name-${index}`}
                      value={medication.name}
                      aria-invalid={Boolean(
                        fieldError(fieldErrors, index, "name")
                      )}
                      onChange={(e) =>
                        updateMedication(index, "name", e.target.value)
                      }
                    />
                  </Field>
                  <Field id={`presentation-${index}`} label="Presentación">
                    <Input
                      id={`presentation-${index}`}
                      value={medication.presentation}
                      onChange={(e) =>
                        updateMedication(index, "presentation", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    id={`dosage-${index}`}
                    label="Dosis"
                    error={fieldError(fieldErrors, index, "dosage")}
                  >
                    <Input
                      id={`dosage-${index}`}
                      value={medication.dosage}
                      placeholder="Ej. 1 tableta"
                      aria-invalid={Boolean(
                        fieldError(fieldErrors, index, "dosage")
                      )}
                      onChange={(e) =>
                        updateMedication(index, "dosage", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    id={`frequency-${index}`}
                    label="Frecuencia"
                    error={fieldError(fieldErrors, index, "frequency")}
                  >
                    <Input
                      id={`frequency-${index}`}
                      value={medication.frequency}
                      placeholder="Ej. cada 12 horas"
                      aria-invalid={Boolean(
                        fieldError(fieldErrors, index, "frequency")
                      )}
                      onChange={(e) =>
                        updateMedication(index, "frequency", e.target.value)
                      }
                    />
                  </Field>
                  <Field id={`schedule-${index}`} label="Horario sugerido">
                    <Input
                      id={`schedule-${index}`}
                      value={medication.schedule}
                      onChange={(e) =>
                        updateMedication(index, "schedule", e.target.value)
                      }
                      placeholder="08:00 y 20:00"
                    />
                  </Field>
                </div>
              ) : (
                <>
                  <h2 className="mt-3 text-lg font-bold text-text-primary">
                    {medication.name}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {medication.presentation}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {[medication.dosage, medication.frequency, medication.schedule]
                      .filter((part) => part.trim().length > 0)
                      .join(" · ") || "Sin dosis ni frecuencia confirmadas"}
                  </p>
                  {pending.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pending.includes("dosage") ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
                          Pendiente: dosis
                        </span>
                      ) : null}
                      {pending.includes("frequency") ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
                          Pendiente: frecuencia
                        </span>
                      ) : null}
                      {pending.includes("name") ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
                          Pendiente: nombre
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </article>
          );
        })}

        <Field id="startDate" label="Fecha de inicio">
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onFocus={() => {
              if (!startDate) {
                setStartDate(todayIsoDate());
              }
            }}
          />
        </Field>

        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="button" className="w-full" onClick={handleContinue}>
          Confirmar instrucciones
        </Button>
      </div>

      <ConfirmDialog
        open={showReviewModal}
        title="¿Has revisado las instrucciones de tus medicamentos?"
        description={
          <div className="flex flex-col gap-2">
            <p>
              Antes de continuar, verifica que los medicamentos, las dosis, las
              frecuencias y la duración del tratamiento coincidan con tu receta
              médica.
            </p>
            <p>
              Esta información se utilizará para organizar tu tratamiento y sus
              recordatorios.
            </p>
            <p>
              Si algún dato es incorrecto, podría generar inconsistencias en el
              seguimiento.
            </p>
          </div>
        }
        primaryLabel="Sí, he revisado los datos"
        secondaryLabel="Volver a revisar"
        onPrimary={handleReviewConfirmed}
        onSecondary={() => setShowReviewModal(false)}
      />

      <ConfirmDialog
        open={showInsuranceModal}
        title="¿Tienes seguro médico privado?"
        description="Si tienes seguro, revisaremos si cubre tu medicamento (consulta simulada en la demo)."
        primaryLabel="Sí, tengo seguro"
        secondaryLabel="No, continuar sin seguro"
        onPrimary={() => handleHasInsurance(true)}
        onSecondary={() => handleHasInsurance(false)}
      />
    </AppShell>
  );
}
