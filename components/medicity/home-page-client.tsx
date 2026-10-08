import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/medicity/app-shell";

export function HomePageClient() {
  return (
    <AppShell narrow={false} className="max-w-xl px-0 py-0 md:max-w-xl md:px-0">
      <div className="flex flex-col gap-6 px-4 py-4 md:px-0">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold leading-7 text-text-primary">
            Bienvenido a Medicity
          </h1>
          <p className="text-sm text-text-secondary">
            Tu bienestar, más cerca de ti.
          </p>
        </header>

        <div className="relative h-[172px] w-full overflow-hidden rounded-[var(--radius-card)]">
          <Image
            src="/medicity/hero-home.png"
            alt="Farmacia Medicity"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>

        <section
          className="rounded-[var(--radius-card)] bg-medicity-blue-light px-4 py-3.5"
          aria-labelledby="treatments-hero-title"
        >
          <p className="text-xs font-bold tracking-wide text-medicity-blue uppercase">
            Mis tratamientos
          </p>
          <h2
            id="treatments-hero-title"
            className="mt-1 text-[22px] font-bold leading-7 text-text-primary"
          >
            Tus medicamentos
            <br />
            al día
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Guarda tus tratamientos y conoce cuándo necesitas comprar de nuevo.
          </p>
          <Link
            href="/treatments"
            className="mt-2 inline-block text-sm font-bold text-medicity-blue hover:underline"
          >
            Ver mis tratamientos →
          </Link>
        </section>

        <section aria-labelledby="categories-heading">
          <h2
            id="categories-heading"
            className="text-lg font-bold text-text-primary"
          >
            Compra por categoría
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            <div className="rounded-[var(--radius-card)] border border-border-default px-4 py-3.5">
              <p className="font-bold text-text-primary">Medicamentos</p>
              <p className="mt-1 text-sm text-text-secondary">
                Explora productos de farmacia
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-border-default px-4 py-3.5">
              <p className="font-bold text-text-primary">Beneficios SmartClub</p>
              <p className="mt-1 text-sm text-text-secondary">
                Conoce promociones disponibles
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
