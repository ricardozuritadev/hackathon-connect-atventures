"use client";

import { AlertTriangle } from "lucide-react";

import { MedicationCard } from "@/components/prescriptions/medication-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  Medication,
  PrescriptionExtraction,
} from "@/lib/validations/prescription";

type PrescriptionResultsProps = {
  extraction: PrescriptionExtraction;
  onHeaderChange: (
    field: "patientName" | "doctorName" | "prescriptionDate",
    value: string
  ) => void;
  onMedicationChange: (
    index: number,
    field: keyof Medication,
    value: string
  ) => void;
};

const STATUS_LABEL: Record<PrescriptionExtraction["status"], string> = {
  success: "Extracción completa",
  partial: "Extracción parcial",
  unreadable: "Imagen no legible",
};

export function PrescriptionResults({
  extraction,
  onHeaderChange,
  onMedicationChange,
}: PrescriptionResultsProps) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="results-heading">
      <div className="flex flex-col gap-1">
        <h2 id="results-heading" className="text-xl font-semibold tracking-tight">
          Resultado de la extracción
        </h2>
        <p className="text-sm text-muted-foreground">
          Estado: {STATUS_LABEL[extraction.status]}. Puedes corregir cualquier
          campo antes de continuar.
        </p>
      </div>

      {extraction.warnings.length > 0 ? (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30">
          <AlertTriangle />
          <AlertTitle>Advertencias</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {extraction.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Datos de la receta</CardTitle>
          <CardDescription>
            Revisa y edita la información del encabezado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="patientName">Nombre del paciente</Label>
            <Input
              id="patientName"
              value={extraction.patientName ?? ""}
              placeholder="No identificado"
              onChange={(event) =>
                onHeaderChange("patientName", event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doctorName">Nombre del médico</Label>
            <Input
              id="doctorName"
              value={extraction.doctorName ?? ""}
              placeholder="No identificado"
              onChange={(event) =>
                onHeaderChange("doctorName", event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="prescriptionDate">Fecha de la receta</Label>
            <Input
              id="prescriptionDate"
              value={extraction.prescriptionDate ?? ""}
              placeholder="No identificado (YYYY-MM-DD)"
              onChange={(event) =>
                onHeaderChange("prescriptionDate", event.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-medium">Medicamentos</h3>
        {extraction.medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No se identificaron medicamentos. Puedes subir otra imagen o
            verificar la calidad de la foto.
          </p>
        ) : (
          extraction.medications.map((medication, index) => (
            <MedicationCard
              key={`medication-${index}`}
              index={index}
              medication={medication}
              onChange={onMedicationChange}
            />
          ))
        )}
      </div>
    </section>
  );
}
