import { z } from "zod";

import { prescriptionExtractionSchema } from "@/lib/validations/prescription";

export const patientForSchema = z.enum(["self", "family"]);
export type PatientFor = z.infer<typeof patientForSchema>;

export const userProfileSchema = z.object({
  fullName: z.string().min(1),
  documentId: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().optional(),
  birthDate: z.string().min(1),
  patientFor: patientForSchema,
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export const insuranceInfoSchema = z.object({
  hasInsurance: z.boolean(),
  insurer: z.string().optional(),
  policyNumber: z.string().optional(),
  policyHolder: z.string().optional(),
  beneficiary: z.string().optional(),
});
export type InsuranceInfo = z.infer<typeof insuranceInfoSchema>;

export const pricingSummarySchema = z.object({
  normalPrice: z.number(),
  coverageAmount: z.number(),
  copayAmount: z.number(),
  currencyLabel: z.string(),
});
export type PricingSummary = z.infer<typeof pricingSummarySchema>;

export const promotionProgressSchema = z.object({
  participates: z.boolean(),
  currentPurchase: z.number(),
  requiredPurchases: z.number(),
  label: z.string(),
});
export type PromotionProgress = z.infer<typeof promotionProgressSchema>;

export const deliveryModeSchema = z.enum([
  "home_delivery",
  "pharmacy_pickup",
  "reserve_pay_pharmacy",
]);
export type DeliveryMode = z.infer<typeof deliveryModeSchema>;

export const notificationPreferencesSchema = z.object({
  doseReminders: z.boolean(),
  refillReminders: z.boolean(),
  promotions: z.boolean(),
  doseTimes: z.array(z.string()),
  refillDaysBefore: z.number(),
  consented: z.boolean(),
  whatsappActive: z.boolean(),
});
export type NotificationPreferences = z.infer<
  typeof notificationPreferencesSchema
>;

export const confirmedMedicationSchema = z.object({
  name: z.string(),
  presentation: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  schedule: z.string(),
  duration: z.string().nullable(),
  quantity: z.string().nullable(),
});
export type ConfirmedMedication = z.infer<typeof confirmedMedicationSchema>;

export const treatmentSchema = z.object({
  id: z.string(),
  medicationName: z.string(),
  presentation: z.string(),
  instructions: z.string(),
  schedule: z.string(),
  startDate: z.string(),
  nextDoseAt: z.string(),
  estimatedRefillDate: z.string(),
  pricing: pricingSummarySchema,
  promotion: promotionProgressSchema,
  deliveryMode: deliveryModeSchema,
  insurance: insuranceInfoSchema,
  medications: z.array(confirmedMedicationSchema),
  preferences: notificationPreferencesSchema,
  lastPurchaseAt: z.string().nullable(),
  orderId: z.string().nullable(),
});
export type Treatment = z.infer<typeof treatmentSchema>;

export const draftFlowSchema = z.object({
  profile: userProfileSchema.nullable(),
  extraction: prescriptionExtractionSchema.nullable(),
  confirmedMedications: z.array(confirmedMedicationSchema),
  startDate: z.string().nullable(),
  insurance: insuranceInfoSchema.nullable(),
  pricing: pricingSummarySchema.nullable(),
  promotion: promotionProgressSchema.nullable(),
  deliveryMode: deliveryModeSchema.nullable(),
});
export type DraftFlow = z.infer<typeof draftFlowSchema>;

export const demoStateSchema = z.object({
  profile: userProfileSchema.nullable(),
  draft: draftFlowSchema,
  treatments: z.array(treatmentSchema),
  /** ISO timestamp used for demo time-jump simulations */
  demoClock: z.string(),
  doseConfirmedToday: z.boolean(),
});
export type DemoState = z.infer<typeof demoStateSchema>;

export const DEMO_STORAGE_KEY = "mis-tratamientos-demo-v1";

export function createEmptyDraft(): DraftFlow {
  return {
    profile: null,
    extraction: null,
    confirmedMedications: [],
    startDate: null,
    insurance: null,
    pricing: null,
    promotion: null,
    deliveryMode: null,
  };
}

/** Stable empty state for SSR / prerender. Client hydrate sets a real clock. */
export function createInitialDemoState(): DemoState {
  return {
    profile: null,
    draft: createEmptyDraft(),
    treatments: [],
    demoClock: "1970-01-01T00:00:00.000Z",
    doseConfirmedToday: false,
  };
}
