"use client";

import { Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/medicity/app-shell";
import { PrescriptionPreview } from "@/components/prescriptions/prescription-preview";
import { ScreenIntro } from "@/components/treatments/screen-intro";
import { StepProgress } from "@/components/treatments/step-progress";
import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";
import { Button } from "@/components/ui/button";
import type { ApiErrorBody, ApiSuccessBody } from "@/lib/api/errors";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  detectImageMimeType,
} from "@/lib/validations/image";
import type { PrescriptionExtraction } from "@/lib/validations/prescription";

type ExtractApiResponse =
  | ApiSuccessBody<PrescriptionExtraction>
  | ApiErrorBody;

async function validateClientFile(file: File): Promise<string | null> {
  if (file.size === 0) return "El archivo está vacío.";
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

export function PrescriptionUploadFlow() {
  const router = useRouter();
  const { state, setExtraction, hydrated } = useTreatmentDemo();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (hydrated && !state.profile && !state.draft.profile) {
      router.replace("/treatments/register/profile");
    }
  }, [hydrated, state.profile, state.draft.profile, router]);

  async function handleFileChange(nextFile: File | null) {
    setApiError(null);
    setInfoMessage(null);

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

      if (currentRequestId !== requestIdRef.current) return;

      if (!payload.success) {
        setApiError(payload.error.message);
        return;
      }

      setExtraction(payload.data);
      router.push("/treatments/register/confirm");
    } catch {
      if (currentRequestId !== requestIdRef.current) return;
      setApiError(
        "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo."
      );
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsAnalyzing(false);
      }
    }
  }

  const canAnalyze = Boolean(file) && !validationError && !isAnalyzing;

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <StepProgress current={2} />
        <ScreenIntro
          eyebrow="Receta · Paso 2"
          title="Carga tu receta"
          body="Estamos listos para leer tu receta. Identificaremos el medicamento y las instrucciones."
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const next = event.target.files?.[0] ?? null;
            void handleFileChange(next);
          }}
        />

        <button
          type="button"
          disabled={isAnalyzing}
          onClick={() => inputRef.current?.click()}
          className="flex h-[170px] w-full flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed border-border-default bg-muted/40 px-4 text-center disabled:opacity-50"
        >
          <Camera className="size-9 text-medicity-blue" aria-hidden />
          <p className="mt-3 font-bold text-text-primary">
            {file ? file.name : "Tomar o subir foto"}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            JPG, PNG o WebP · máx. 5 MB
          </p>
        </button>

        {validationError ? (
          <p role="alert" className="text-sm text-destructive">
            {validationError}
          </p>
        ) : null}

        {previewUrl && file ? (
          <PrescriptionPreview
            previewUrl={previewUrl}
            fileName={file.name}
            disabled={isAnalyzing}
            onRemove={() => {
              void handleFileChange(null);
            }}
          />
        ) : null}

        <Button
          type="button"
          className="w-full"
          disabled={!canAnalyze}
          onClick={() => {
            void handleAnalyze();
          }}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" data-icon="inline-start" />
              Analizando…
            </>
          ) : (
            "Analizar"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isAnalyzing}
          onClick={() =>
            setInfoMessage(
              "Registrar un medicamento sin receta estará disponible en una evolución. En esta demo continúa con una receta."
            )
          }
        >
          Registrar sin receta
        </Button>

        <button
          type="button"
          className="text-center text-sm text-text-secondary underline-offset-2 hover:underline"
          disabled={isAnalyzing}
          onClick={() =>
            setInfoMessage(
              "Omitir la receta no está disponible en el camino demo cuando el medicamento lo requiere."
            )
          }
        >
          Omitir por ahora
        </button>

        <div aria-live="polite" className="min-h-6">
          {isAnalyzing ? (
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Estamos leyendo tu receta…
            </p>
          ) : null}
          {apiError ? (
            <p role="alert" className="text-sm text-destructive">
              {apiError}
            </p>
          ) : null}
          {infoMessage ? (
            <p className="text-sm text-text-secondary">{infoMessage}</p>
          ) : null}
        </div>

        <p className="text-center text-xs text-text-secondary">
          <Link href="/treatments" className="text-medicity-blue hover:underline">
            Volver a Mis tratamientos
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
