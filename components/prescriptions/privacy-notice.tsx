import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PrivacyNotice() {
  return (
    <div className="flex flex-col gap-3">
      <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-50">
        <AlertTriangle />
        <AlertTitle>Versión de demostración</AlertTitle>
        <AlertDescription>
          Esta es una versión de demostración. Utiliza únicamente recetas
          ficticias.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertTriangle />
        <AlertTitle>Verificación requerida</AlertTitle>
        <AlertDescription>
          La información extraída por inteligencia artificial puede contener
          errores. Verifica todos los datos con la receta original antes de
          continuar.
        </AlertDescription>
      </Alert>
    </div>
  );
}
