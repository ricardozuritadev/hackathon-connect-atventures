import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Mis Tratamientos
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Continuidad del tratamiento, simplificada
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Prototipo de demostración para digitalizar recetas médicas con
          inteligencia artificial. Usa únicamente recetas ficticias.
        </p>
      </div>
      <div>
        <Link
          href="/prescriptions/extract"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Digitalizar receta
        </Link>
      </div>
    </main>
  );
}
