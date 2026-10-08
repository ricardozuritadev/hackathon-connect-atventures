"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Medication } from "@/lib/validations/prescription";

type MedicationCardProps = {
  index: number;
  medication: Medication;
  onChange: (index: number, field: keyof Medication, value: string) => void;
};

const FIELDS: Array<{
  key: keyof Medication;
  label: string;
  multiline?: boolean;
}> = [
  { key: "name", label: "Nombre del medicamento" },
  { key: "strength", label: "Concentración" },
  { key: "dosage", label: "Dosis" },
  { key: "frequency", label: "Frecuencia" },
  { key: "duration", label: "Duración" },
  { key: "quantity", label: "Cantidad" },
  { key: "administrationRoute", label: "Vía de administración" },
  { key: "instructions", label: "Indicaciones adicionales", multiline: true },
];

function displayValue(value: string | null): string {
  return value ?? "";
}

export function MedicationCard({
  index,
  medication,
  onChange,
}: MedicationCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          Medicamento {index + 1}
          {medication.name ? `: ${medication.name}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const id = `medication-${index}-${field.key}`;
          const value = displayValue(medication[field.key]);
          const placeholder = "No identificado";

          return (
            <div
              key={field.key}
              className={
                field.multiline ? "flex flex-col gap-1.5 sm:col-span-2" : "flex flex-col gap-1.5"
              }
            >
              <Label htmlFor={id}>{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  id={id}
                  value={value}
                  placeholder={placeholder}
                  onChange={(event) =>
                    onChange(index, field.key, event.target.value)
                  }
                />
              ) : (
                <Input
                  id={id}
                  value={value}
                  placeholder={placeholder}
                  onChange={(event) =>
                    onChange(index, field.key, event.target.value)
                  }
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
