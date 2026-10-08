"use client";

import { useId } from "react";
import { Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_IMAGE_BYTES } from "@/lib/validations/image";

type PrescriptionUploadProps = {
  fileName: string | null;
  error: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
};

const MAX_MB = MAX_IMAGE_BYTES / (1024 * 1024);

export function PrescriptionUpload({
  fileName,
  error,
  disabled = false,
  onFileChange,
}: PrescriptionUploadProps) {
  const inputId = useId();
  const errorId = useId();
  const hintId = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>Imagen de la receta</Label>
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Upload
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <Input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              disabled={disabled}
              aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
              aria-invalid={error ? true : undefined}
              className="cursor-pointer file:cursor-pointer"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                onFileChange(next);
                // Allow re-selecting the same file after clear
                event.target.value = "";
              }}
            />
            <p id={hintId} className="mt-2 text-sm text-muted-foreground">
              Formatos: JPG, PNG o WebP. Tamaño máximo: {MAX_MB} MB.
            </p>
            {fileName ? (
              <p className="mt-1 truncate text-sm text-foreground">
                Archivo seleccionado:{" "}
                <span className="font-medium">{fileName}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
