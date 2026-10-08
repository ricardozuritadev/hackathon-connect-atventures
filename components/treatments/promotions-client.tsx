import Link from "next/link";

import { AppShell } from "@/components/medicity/app-shell";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PromotionsClient() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <ScreenIntro
          eyebrow="Beneficios Medicity"
          title="Promociones para ti"
          body="Consulta qué beneficios aplican a tus medicamentos."
        />

        <article className="relative overflow-hidden rounded-[var(--radius-card)] border border-border-default">
          <div
            className="absolute top-0 bottom-0 left-0 w-1.5 bg-medicity-green"
            aria-hidden
          />
          <div className="px-4 py-3.5 pl-5">
            <h2 className="font-bold text-text-primary">Beneficio SmartClub</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Descuento sujeto a producto y vigencia.
            </p>
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-border-default px-4 py-3.5">
          <h3 className="font-bold text-text-primary">Losartán 50 mg</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Verifica promociones y precio actual.
          </p>
        </article>

        <article className="rounded-[var(--radius-card)] border border-border-default px-4 py-3.5">
          <h3 className="font-bold text-text-primary">Metformina 850 mg</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Revisa promociones vigentes en tienda.
          </p>
        </article>

        <p className="text-xs text-text-secondary">
          Los descuentos y la cobertura del seguro pueden variar según tu póliza
          y las condiciones del programa.
        </p>

        <Link
          href="/treatments"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full text-center"
          )}
        >
          Volver a mis tratamientos
        </Link>
      </div>
    </AppShell>
  );
}
