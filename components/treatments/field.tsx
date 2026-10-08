import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
  hint?: string;
  error?: string;
};

export function Field({ id, label, children, className, hint, error }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-bold text-text-primary">
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-text-secondary">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
