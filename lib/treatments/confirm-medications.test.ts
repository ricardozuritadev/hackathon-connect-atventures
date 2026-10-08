import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  extractionSeedKey,
  pendingFields,
  summarizeValidationErrors,
  toConfirmedMedication,
  validateConfirmedMedications,
} from "@/lib/treatments/confirm-medications";
import type { ConfirmedMedication } from "@/lib/treatments/types";
import type { Medication } from "@/lib/validations/prescription";

function med(partial: Partial<Medication>): Medication {
  return {
    name: null,
    strength: null,
    dosage: null,
    frequency: null,
    duration: null,
    quantity: null,
    administrationRoute: null,
    instructions: null,
    ...partial,
  };
}

describe("toConfirmedMedication", () => {
  it("keeps extracted dosage and frequency", () => {
    const result = toConfirmedMedication(
      med({
        name: "Losartán",
        strength: "50 mg",
        dosage: "1 tableta",
        frequency: "cada 12 horas",
        instructions: "Con alimentos",
      })
    );

    assert.equal(result.name, "Losartán");
    assert.equal(result.dosage, "1 tableta");
    assert.equal(result.frequency, "cada 12 horas");
    assert.equal(result.schedule, "Con alimentos");
    assert.equal(result.presentation, "50 mg");
  });

  it("does not invent Completar placeholders for missing dose or frequency", () => {
    const result = toConfirmedMedication(
      med({
        name: "Metformina",
        instructions: "Según indicación médica",
      })
    );

    assert.equal(result.dosage, "");
    assert.equal(result.frequency, "");
    assert.equal(result.schedule, "Según indicación médica");
    assert.doesNotMatch(result.dosage, /Completar/);
    assert.doesNotMatch(result.frequency, /Completar/);
  });
});

describe("validateConfirmedMedications", () => {
  it("accepts complete medication data", () => {
    const medications: ConfirmedMedication[] = [
      {
        name: "Losartán",
        presentation: "50 mg",
        dosage: "1 tableta",
        frequency: "cada 12 horas",
        schedule: "08:00 y 20:00",
        duration: null,
        quantity: "30",
      },
    ];

    assert.deepEqual(validateConfirmedMedications(medications), []);
  });

  it("reports missing dosage with medication name", () => {
    const medications: ConfirmedMedication[] = [
      {
        name: "Losartán",
        presentation: "50 mg",
        dosage: "",
        frequency: "cada 12 horas",
        schedule: "",
        duration: null,
        quantity: null,
      },
    ];

    const errors = validateConfirmedMedications(medications);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].field, "dosage");
    assert.match(errors[0].message, /Losartán/);
  });

  it("reports missing frequency", () => {
    const medications: ConfirmedMedication[] = [
      {
        name: "Losartán",
        presentation: "50 mg",
        dosage: "1 tableta",
        frequency: "  ",
        schedule: "",
        duration: null,
        quantity: null,
      },
    ];

    const errors = validateConfirmedMedications(medications);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].field, "frequency");
  });

  it("validates multiple medications independently", () => {
    const medications: ConfirmedMedication[] = [
      {
        name: "Losartán",
        presentation: "50 mg",
        dosage: "1 tableta",
        frequency: "cada 12 horas",
        schedule: "",
        duration: null,
        quantity: null,
      },
      {
        name: "Metformina",
        presentation: "850 mg",
        dosage: "",
        frequency: "",
        schedule: "",
        duration: null,
        quantity: null,
      },
    ];

    const errors = validateConfirmedMedications(medications);
    assert.equal(errors.length, 2);
    assert.equal(errors[0].medicationIndex, 1);
    assert.equal(errors[1].medicationIndex, 1);
  });

  it("blocks empty medication list fields without inventing values", () => {
    const confirmed = toConfirmedMedication(med({ name: "Aspirina" }));
    const errors = validateConfirmedMedications([confirmed]);
    assert.ok(errors.some((error) => error.field === "dosage"));
    assert.ok(errors.some((error) => error.field === "frequency"));
  });
});

describe("pendingFields and summarizeValidationErrors", () => {
  it("lists pending dosage and frequency", () => {
    const pending = pendingFields({
      name: "Losartán",
      presentation: "50 mg",
      dosage: "",
      frequency: "",
      schedule: "texto",
      duration: null,
      quantity: null,
    });
    assert.deepEqual(pending, ["dosage", "frequency"]);
  });

  it("summarizes multiple errors", () => {
    const summary = summarizeValidationErrors([
      {
        medicationIndex: 0,
        medicationName: "A",
        field: "dosage",
        message: "Completa la dosis de A.",
      },
      {
        medicationIndex: 0,
        medicationName: "A",
        field: "frequency",
        message: "Completa la frecuencia de A.",
      },
    ]);
    assert.match(summary, /Completa la dosis de A/);
    assert.match(summary, /1 campo/);
  });
});

describe("extractionSeedKey", () => {
  it("is stable for the same extraction identity", () => {
    const medications = [med({ name: "Losartán" }), med({ name: "Metformina" })];
    assert.equal(
      extractionSeedKey(medications, "2026-01-01"),
      extractionSeedKey(medications, "2026-01-01")
    );
  });
});
