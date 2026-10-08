import {
  DEMO_STORAGE_KEY,
  createInitialDemoState,
  demoStateSchema,
  type DemoState,
} from "@/lib/treatments/types";

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") {
    return createInitialDemoState();
  }

  try {
    const raw = window.sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      return createInitialDemoState();
    }
    const parsed: unknown = JSON.parse(raw);
    const result = demoStateSchema.safeParse(parsed);
    if (!result.success) {
      return createInitialDemoState();
    }
    return result.data;
  } catch {
    return createInitialDemoState();
  }
}

export function saveDemoState(state: DemoState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
}

export function clearDemoState(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
}
