import {
  createInitialDemoState,
  type DemoState,
} from "@/lib/treatments/types";
import { loadDemoState, saveDemoState } from "@/lib/demo/session-store";

let demoState: DemoState = createInitialDemoState();
let hasHydrated = false;
const listeners = new Set<() => void>();

/** Stable reference required by useSyncExternalStore getServerSnapshot. */
const serverSnapshot: DemoState = createInitialDemoState();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeDemoStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDemoStoreSnapshot(): DemoState {
  return demoState;
}

export function getDemoStoreServerSnapshot(): DemoState {
  return serverSnapshot;
}

export function isDemoStoreHydrated(): boolean {
  return hasHydrated;
}

export function hydrateDemoStore(): void {
  if (hasHydrated) return;
  const loaded = loadDemoState();
  const isPlaceholderClock = loaded.demoClock.startsWith("1970-01-01");
  demoState = {
    ...loaded,
    demoClock: isPlaceholderClock
      ? new Date().toISOString()
      : loaded.demoClock,
  };
  hasHydrated = true;
  saveDemoState(demoState);
  emit();
}

export function updateDemoStore(
  updater: (prev: DemoState) => DemoState
): void {
  demoState = updater(demoState);
  if (hasHydrated) {
    saveDemoState(demoState);
  }
  emit();
}
