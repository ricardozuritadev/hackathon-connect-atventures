import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { prescriptionExtractionSchema } from "./prescription";

describe("prescriptionExtractionSchema", () => {
  it("accepts a valid extraction with null medication fields", () => {
    const result = prescriptionExtractionSchema.safeParse({
      status: "success",
      patientName: "Juan Pérez",
      doctorName: null,
      prescriptionDate: "2026-10-08",
      medications: [
        {
          name: "Losartán",
          strength: "50 mg",
          dosage: "1 comprimido",
          frequency: "Cada 24 horas",
          duration: "30 días",
          quantity: "30 comprimidos",
          administrationRoute: null,
          instructions: null,
        },
      ],
      warnings: [],
    });
    assert.equal(result.success, true);
  });

  it("accepts unreadable results with empty medications", () => {
    const result = prescriptionExtractionSchema.safeParse({
      status: "unreadable",
      patientName: null,
      doctorName: null,
      prescriptionDate: null,
      medications: [],
      warnings: ["La imagen no es legible"],
    });
    assert.equal(result.success, true);
  });

  it("rejects invalid status values", () => {
    const result = prescriptionExtractionSchema.safeParse({
      status: "ok",
      patientName: null,
      doctorName: null,
      prescriptionDate: null,
      medications: [],
      warnings: [],
    });
    assert.equal(result.success, false);
  });
});
