"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type PrescriptionPreviewProps = {
  previewUrl: string;
  fileName: string;
  disabled?: boolean;
  onRemove: () => void;
};

export function PrescriptionPreview({
  previewUrl,
  fileName,
  disabled = false,
  onRemove,
}: PrescriptionPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Vista previa</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onRemove}
          aria-label="Quitar imagen"
        >
          <X data-icon="inline-start" />
          Quitar
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
        {/* Native img: blob/object URLs are client-only local previews */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={`Vista previa de ${fileName}`}
          className="h-auto max-h-[420px] w-full object-contain"
        />
      </div>
    </div>
  );
}
