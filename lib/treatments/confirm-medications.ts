import type { ConfirmedMedication } from "@/lib/treatments/types";
import type { Medication } from "@/lib/validations/prescription";

export type MedicationValidationField = "name" | "dosage" | "frequency";

export type MedicationValidationError = {
  medicationIndex: number;
  medicationName: string;
  field: MedicationValidationField;
  message: string;
};

function trimOrEmpty(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Maps OCR medication fields into editable confirmed medication state.
 * Missing dose/frequency stay empty — never invent medical instructions.
 */
export function toConfirmedMedication(
  medication: Medication
): ConfirmedMedication {
  const name = trimOrEmpty(medication.name) || "Medicamento";
  const presentation = [medication.strength, medication.quantity]
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => part.trim())
    .join(" · ");
  const dosage = trimOrEmpty(medication.dosage);
  const frequency = trimOrEmpty(medication.frequency);
  const schedule = trimOrEmpty(medication.instructions);

  return {
    name,
    presentation: presentation || "Presentación por confirmar",
    dosage,
    frequency,
    schedule,
    duration: medication.duration,
    quantity: medication.quantity,
  };
}

export function extractionSeedKey(
  medications: Medication[],
  prescriptionDate: string | null
): string {
  const names = medications.map((med) => med.name?.trim() ?? "").join("|");
  return `${medications.length}:${names}:${prescriptionDate ?? ""}`;
}

export function pendingFields(
  medication: ConfirmedMedication
): MedicationValidationField[] {
  const pending: MedicationValidationField[] = [];
  if (!medication.name.trim()) {
    pending.push("name");
  }
  if (!medication.dosage.trim()) {
    pending.push("dosage");
  }
  if (!medication.frequency.trim()) {
    pending.push("frequency");
  }
  return pending;
}

export function validateConfirmedMedications(
  medications: ConfirmedMedication[]
): MedicationValidationError[] {
  const errors: MedicationValidationError[] = [];

  medications.forEach((medication, medicationIndex) => {
    const displayName =
      medication.name.trim() || `Medicamento ${medicationIndex + 1}`;

    if (!medication.name.trim()) {
      errors.push({
        medicationIndex,
        medicationName: displayName,
        field: "name",
        message: `Indica el nombre del medicamento ${medicationIndex + 1}.`,
      });
    }

    if (!medication.dosage.trim()) {
      errors.push({
        medicationIndex,
        medicationName: displayName,
        field: "dosage",
        message: `Completa la dosis de ${displayName}.`,
      });
    }

    if (!medication.frequency.trim()) {
      errors.push({
        medicationIndex,
        medicationName: displayName,
        field: "frequency",
        message: `Completa la frecuencia de ${displayName}.`,
      });
    }
  });

  return errors;
}

export function summarizeValidationErrors(
  errors: MedicationValidationError[]
): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0].message;
  return `${errors[0].message} (${errors.length - 1} campo(s) más por completar).`;
}
