"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  getDemoStoreServerSnapshot,
  getDemoStoreSnapshot,
  hydrateDemoStore,
  isDemoStoreHydrated,
  subscribeDemoStore,
  updateDemoStore,
} from "@/lib/demo/demo-store";
import {
  DEMO_PRICING_WITH_INSURANCE,
  DEMO_PRICING_WITHOUT_INSURANCE,
  DEMO_PROMOTION,
  addDaysIso,
  buildPromotionLabel,
  createOrderId,
  createTreatmentId,
} from "@/lib/demo/fixtures";
import {
  createEmptyDraft,
  type ConfirmedMedication,
  type DemoState,
  type DeliveryMode,
  type DraftFlow,
  type InsuranceInfo,
  type NotificationPreferences,
  type Treatment,
  type UserProfile,
} from "@/lib/treatments/types";
import type { PrescriptionExtraction } from "@/lib/validations/prescription";

type TreatmentDemoContextValue = {
  state: DemoState;
  hydrated: boolean;
  setProfile: (profile: UserProfile) => void;
  setExtraction: (extraction: PrescriptionExtraction) => void;
  setConfirmedInstructions: (
    medications: ConfirmedMedication[],
    startDate: string
  ) => void;
  setInsurance: (insurance: InsuranceInfo) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  completePurchase: (mode: DeliveryMode) => Treatment | null;
  activateWhatsApp: (preferences: NotificationPreferences) => void;
  confirmDose: () => void;
  jumpDemoDays: (days: number) => void;
  completeRepurchase: (treatmentId: string) => void;
  resetDraft: () => void;
  getTreatment: (id: string) => Treatment | undefined;
};

const TreatmentDemoContext = createContext<TreatmentDemoContextValue | null>(
  null
);

function applyPricing(insurance: InsuranceInfo | null): DraftFlow["pricing"] {
  if (!insurance?.hasInsurance) {
    return DEMO_PRICING_WITHOUT_INSURANCE;
  }
  return DEMO_PRICING_WITH_INSURANCE;
}

function subscribeHydration(listener: () => void): () => void {
  return subscribeDemoStore(listener);
}

function getHydratedSnapshot(): boolean {
  return isDemoStoreHydrated();
}

function getHydratedServerSnapshot(): boolean {
  return false;
}

export function TreatmentDemoProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    subscribeDemoStore,
    getDemoStoreSnapshot,
    getDemoStoreServerSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getHydratedServerSnapshot
  );

  useEffect(() => {
    hydrateDemoStore();
  }, []);

  const setProfile = useCallback((profile: UserProfile) => {
    updateDemoStore((prev) => ({
      ...prev,
      profile,
      draft: { ...prev.draft, profile },
    }));
  }, []);

  const setExtraction = useCallback((extraction: PrescriptionExtraction) => {
    updateDemoStore((prev) => ({
      ...prev,
      draft: { ...prev.draft, extraction },
    }));
  }, []);

  const setConfirmedInstructions = useCallback(
    (medications: ConfirmedMedication[], startDate: string) => {
      updateDemoStore((prev) => ({
        ...prev,
        draft: {
          ...prev.draft,
          confirmedMedications: medications,
          startDate,
        },
      }));
    },
    []
  );

  const setInsurance = useCallback((insurance: InsuranceInfo) => {
    updateDemoStore((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        insurance,
        pricing: applyPricing(insurance),
        promotion: DEMO_PROMOTION,
      },
    }));
  }, []);

  const setDeliveryMode = useCallback((mode: DeliveryMode) => {
    updateDemoStore((prev) => ({
      ...prev,
      draft: { ...prev.draft, deliveryMode: mode },
    }));
  }, []);

  const completePurchase = useCallback(
    (mode: DeliveryMode): Treatment | null => {
      const draft = getDemoStoreSnapshot().draft;
      const primary = draft.confirmedMedications[0];
      if (!primary || !draft.pricing || !draft.promotion) {
        return null;
      }

      const now = getDemoStoreSnapshot().demoClock;
      const nextDose = new Date(now);
      nextDose.setHours(8, 0, 0, 0);
      if (nextDose.getTime() < new Date(now).getTime()) {
        nextDose.setHours(20, 0, 0, 0);
      }

      const treatment: Treatment = {
        id: createTreatmentId(),
        medicationName: primary.name,
        presentation: primary.presentation,
        instructions: `${primary.dosage} · ${primary.frequency}`,
        schedule: primary.schedule,
        startDate: draft.startDate ?? now.slice(0, 10),
        nextDoseAt: nextDose.toISOString(),
        estimatedRefillDate: addDaysIso(now, 30),
        pricing: draft.pricing,
        promotion: {
          ...draft.promotion,
          currentPurchase: 1,
          label: buildPromotionLabel(1, draft.promotion.requiredPurchases),
        },
        deliveryMode: mode,
        insurance: draft.insurance ?? { hasInsurance: false },
        medications: draft.confirmedMedications,
        preferences: {
          doseReminders: true,
          refillReminders: true,
          promotions: true,
          doseTimes: ["08:00", "20:00"],
          refillDaysBefore: 5,
          consented: false,
          whatsappActive: false,
        },
        lastPurchaseAt: now,
        orderId: createOrderId(),
      };

      updateDemoStore((prev) => ({
        ...prev,
        treatments: [treatment, ...prev.treatments],
        doseConfirmedToday: false,
      }));

      return treatment;
    },
    []
  );

  const activateWhatsApp = useCallback(
    (preferences: NotificationPreferences) => {
      updateDemoStore((prev) => {
        const [latest, ...rest] = prev.treatments;
        if (!latest) return prev;
        return {
          ...prev,
          treatments: [
            {
              ...latest,
              preferences: {
                ...preferences,
                whatsappActive: true,
                consented: true,
              },
            },
            ...rest,
          ],
        };
      });
    },
    []
  );

  const confirmDose = useCallback(() => {
    updateDemoStore((prev) => {
      const [latest, ...rest] = prev.treatments;
      if (!latest) return prev;
      const next = new Date(prev.demoClock);
      next.setHours(20, 0, 0, 0);
      return {
        ...prev,
        doseConfirmedToday: true,
        treatments: [{ ...latest, nextDoseAt: next.toISOString() }, ...rest],
      };
    });
  }, []);

  const jumpDemoDays = useCallback((days: number) => {
    updateDemoStore((prev) => ({
      ...prev,
      demoClock: addDaysIso(prev.demoClock, days),
      doseConfirmedToday: false,
    }));
  }, []);

  const completeRepurchase = useCallback((treatmentId: string) => {
    updateDemoStore((prev) => {
      const treatments = prev.treatments.map((treatment) => {
        if (treatment.id !== treatmentId) return treatment;
        const nextPurchase = Math.min(
          treatment.promotion.currentPurchase + 1,
          treatment.promotion.requiredPurchases
        );
        return {
          ...treatment,
          lastPurchaseAt: prev.demoClock,
          orderId: createOrderId(),
          estimatedRefillDate: addDaysIso(prev.demoClock, 30),
          pricing: treatment.insurance.hasInsurance
            ? DEMO_PRICING_WITH_INSURANCE
            : DEMO_PRICING_WITHOUT_INSURANCE,
          promotion: {
            ...treatment.promotion,
            currentPurchase: nextPurchase,
            label: buildPromotionLabel(
              nextPurchase,
              treatment.promotion.requiredPurchases
            ),
          },
        };
      });
      return { ...prev, treatments };
    });
  }, []);

  const resetDraft = useCallback(() => {
    updateDemoStore((prev) => ({ ...prev, draft: createEmptyDraft() }));
  }, []);

  const getTreatment = useCallback(
    (id: string) => state.treatments.find((t) => t.id === id),
    [state.treatments]
  );

  const value = useMemo<TreatmentDemoContextValue>(
    () => ({
      state,
      hydrated,
      setProfile,
      setExtraction,
      setConfirmedInstructions,
      setInsurance,
      setDeliveryMode,
      completePurchase,
      activateWhatsApp,
      confirmDose,
      jumpDemoDays,
      completeRepurchase,
      resetDraft,
      getTreatment,
    }),
    [
      state,
      hydrated,
      setProfile,
      setExtraction,
      setConfirmedInstructions,
      setInsurance,
      setDeliveryMode,
      completePurchase,
      activateWhatsApp,
      confirmDose,
      jumpDemoDays,
      completeRepurchase,
      resetDraft,
      getTreatment,
    ]
  );

  return (
    <TreatmentDemoContext.Provider value={value}>
      {children}
    </TreatmentDemoContext.Provider>
  );
}

export function useTreatmentDemo(): TreatmentDemoContextValue {
  const context = useContext(TreatmentDemoContext);
  if (!context) {
    throw new Error("useTreatmentDemo must be used within TreatmentDemoProvider");
  }
  return context;
}
