"use client";

import { useEffect, useId, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryVariant?: "default" | "outline" | "whatsapp";
};

export function ConfirmDialog({
  open,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryVariant = "default",
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onSecondary();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onSecondary]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-white p-5 shadow-xl">
        <h2 id={titleId} className="text-lg font-bold text-text-primary">
          {title}
        </h2>
        <div id={descriptionId} className="mt-2 text-sm text-text-secondary">
          {description}
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <Button
            type="button"
            variant={primaryVariant}
            className="w-full"
            autoFocus
            onClick={onPrimary}
          >
            {primaryLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
