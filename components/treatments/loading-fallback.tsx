import { AppShell } from "@/components/medicity/app-shell";

export function LoadingFallback() {
  return (
    <AppShell>
      <p className="text-sm text-text-secondary">Cargando…</p>
    </AppShell>
  );
}
