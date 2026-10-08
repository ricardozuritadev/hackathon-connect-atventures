"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { PrescriptionPreview } from "@/components/prescriptions/prescription-preview";
import { PrescriptionResults } from "@/components/prescriptions/prescription-results";
import { PrescriptionUpload } from "@/components/prescriptions/prescription-upload";
import { PrivacyNotice } from "@/components/prescriptions/privacy-notice";
import { Button } from "@/components/ui/button";
import type { ApiErrorBody, ApiSuccessBody } from "@/lib/api/errors";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  detectImageMimeType,
} from "@/lib/validations/image";
import type {
  Medication,
  PrescriptionExtraction,
} from "@/lib/validations/prescription";

type ExtractApiResponse =
  | ApiSuccessBody<PrescriptionExtraction>
  | ApiErrorBody;

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function validateClientFile(file: File): Promise<string | null> {
  if (file.size === 0) {
    return "El archivo está vacío.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "La imagen no puede superar 5 MB.";
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const detected = detectImageMimeType(bytes);
  if (!detected) {
    return "El archivo debe ser una imagen JPG, PNG o WebP válida.";
  }

  if (
    file.type &&
    file.type !== "application/octet-stream" &&
    file.type !== "image/jpg" &&
    !ALLOWED_IMAGE_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
    )
  ) {
    return "El archivo debe ser una imagen JPG, PNG o WebP.";
  }

  return null;
}

export function PrescriptionExtractClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extraction, setExtraction] = useState<PrescriptionExtraction | null>(
    null
  );
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleFileChange(nextFile: File | null) {
    setApiError(null);
    setExtraction(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!nextFile) {
      setFile(null);
      setValidationError(null);
      return;
    }

    const error = await validateClientFile(nextFile);
    if (error) {
      setFile(null);
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
  }

  function handleRemove() {
    void handleFileChange(null);
  }

  async function handleAnalyze() {
    if (!file || validationError || isAnalyzing) return;

    const currentRequestId = ++requestIdRef.current;
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/prescriptions/extract", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as ExtractApiResponse;

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (!payload.success) {
        setExtraction(null);
        setApiError(payload.error.message);
        return;
      }

      setExtraction(payload.data);
    } catch {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      setExtraction(null);
      setApiError(
        "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo."
      );
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsAnalyzing(false);
      }
    }
  }

  function handleHeaderChange(
    field: "patientName" | "doctorName" | "prescriptionDate",
    value: string
  ) {
    setExtraction((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: emptyToNull(value) };
    });
  }

  function handleMedicationChange(
    index: number,
    field: keyof Medication,
    value: string
  ) {
    setExtraction((prev) => {
      if (!prev) return prev;
      const medications = prev.medications.map((medication, i) => {
        if (i !== index) return medication;
        return { ...medication, [field]: emptyToNull(value) };
      });
      return { ...prev, medications };
    });
  }

  const canAnalyze = Boolean(file) && !validationError && !isAnalyzing;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Mis Tratamientos
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Digitalizar receta
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Sube una fotografía de tu receta y Mis Tratamientos identificará
          automáticamente los medicamentos y sus indicaciones.
        </p>
      </header>

      <PrivacyNotice />

      <section
        className="flex flex-col gap-4"
        aria-labelledby="upload-section-heading"
      >
        <h2 id="upload-section-heading" className="sr-only">
          Carga de imagen
        </h2>

        <PrescriptionUpload
          fileName={file?.name ?? null}
          error={validationError}
          disabled={isAnalyzing}
          onFileChange={handleFileChange}
        />

        {previewUrl && file ? (
          <PrescriptionPreview
            previewUrl={previewUrl}
            fileName={file.name}
            disabled={isAnalyzing}
            onRemove={handleRemove}
          />
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            disabled={!canAnalyze}
            onClick={() => {
              void handleAnalyze();
            }}
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Analizando…
              </>
            ) : (
              "Analizar receta"
            )}
          </Button>

          <div aria-live="polite" className="min-h-6">
            {isAnalyzing ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Estamos analizando tu receta…
              </p>
            ) : null}
            {apiError ? (
              <p role="alert" className="text-sm text-destructive">
                {apiError}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {extraction ? (
        <PrescriptionResults
          extraction={extraction}
          onHeaderChange={handleHeaderChange}
          onMedicationChange={handleMedicationChange}
        />
      ) : null}
    </div>
  );
}
