import { INSURERS } from "@/lib/demo/fixtures";
import type { UserProfile } from "@/lib/treatments/types";

/**
 * Frozen fictional persona for hackathon form tap-to-fill.
 * Not a real patient. Never used for medication dose/frequency fields.
 */
export const DEMO_PERSONA = {
  profile: {
    fullName: "Andrea Demo",
    documentId: "0999999999",
    phone: "0990000000",
    birthDate: "1990-05-15",
    patientFor: "self",
  } satisfies UserProfile,
  insurance: {
    insurer: INSURERS[0],
    policyNumber: "DEMO-POLIZA-001",
    beneficiary: "self",
  },
} as const;

export type DemoPersona = typeof DEMO_PERSONA;

/** Fill only empty string fields; never overwrite user edits. */
export function fillEmptyString(
  current: string,
  demoValue: string
): string {
  return current.trim().length > 0 ? current : demoValue;
}
