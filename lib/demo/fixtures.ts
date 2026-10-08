import type {
  PricingSummary,
  PromotionProgress,
} from "@/lib/treatments/types";

/** Simulated insurer catalog for the hackathon demo. */
export const INSURERS = [
  "Seguros Equinoccial",
  "Saludsa",
  "BMI",
  "Metropolitana",
] as const;

export type InsurerName = (typeof INSURERS)[number];

/**
 * Demo pricing for a recurrent prescription medication.
 * Insurance coverage and PMF promotion are intentionally separate.
 */
export const DEMO_PRICING_WITH_INSURANCE: PricingSummary = {
  normalPrice: 28.5,
  coverageAmount: 20.0,
  copayAmount: 8.5,
  currencyLabel: "USD",
};

export const DEMO_PRICING_WITHOUT_INSURANCE: PricingSummary = {
  normalPrice: 28.5,
  coverageAmount: 0,
  copayAmount: 28.5,
  currencyLabel: "USD",
};

export const DEMO_PROMOTION: PromotionProgress = {
  participates: true,
  currentPurchase: 1,
  requiredPurchases: 3,
  label: "Compra 1 de 3 · Beneficio Mis tratamientos",
};

export function formatMoney(
  amount: number,
  currencyLabel = "USD"
): string {
  return `$${amount.toFixed(2)} ${currencyLabel}`;
}

export function buildPromotionLabel(
  current: number,
  required: number
): string {
  return `Compra ${current} de ${required} · Beneficio Mis tratamientos`;
}

export function addDaysIso(baseIso: string, days: number): string {
  const date = new Date(baseIso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function formatDisplayDate(iso: string): string {
  return new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function formatDisplayDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-EC", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function createOrderId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `MC-${suffix}`;
}

export function createTreatmentId(): string {
  return `tx-${Date.now().toString(36)}`;
}
