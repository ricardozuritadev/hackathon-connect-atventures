import { z } from "zod";

const nullableString = z.string().nullable();

export const medicationSchema = z.object({
  name: nullableString,
  strength: nullableString,
  dosage: nullableString,
  frequency: nullableString,
  duration: nullableString,
  quantity: nullableString,
  administrationRoute: nullableString,
  instructions: nullableString,
});

export const prescriptionExtractionSchema = z.object({
  status: z.enum(["success", "partial", "unreadable"]),
  patientName: nullableString,
  doctorName: nullableString,
  prescriptionDate: nullableString,
  medications: z.array(medicationSchema),
  warnings: z.array(z.string()),
});

export type Medication = z.infer<typeof medicationSchema>;
export type PrescriptionExtraction = z.infer<
  typeof prescriptionExtractionSchema
>;
