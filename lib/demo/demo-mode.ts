const DEMO_SESSION_KEY = "mis-tratamientos-demo-mode";

/**
 * Demo Mode for the hackathon live presentation.
 * Enabled when NEXT_PUBLIC_DEMO_MODE=true, or via session override.
 * Never invents medical OCR fields; only non-clinical form helpers.
 */
export function isEnvDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function getSessionDemoOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(DEMO_SESSION_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

export function setSessionDemoOverride(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DEMO_SESSION_KEY, enabled ? "true" : "false");
}

export function clearSessionDemoOverride(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DEMO_SESSION_KEY);
}

export function isDemoMode(): boolean {
  const override = getSessionDemoOverride();
  if (override !== null) return override;
  return isEnvDemoMode();
}
