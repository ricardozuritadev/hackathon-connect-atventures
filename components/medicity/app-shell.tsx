import type { ReactNode } from "react";

import { MedicityHeader } from "@/components/medicity/medicity-header";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  /** Constrain main content for flow screens (mobile-first column). */
  narrow?: boolean;
  className?: string;
};

export function AppShell({ children, narrow = true, className }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <MedicityHeader />
      <main
        className={cn(
          "mx-auto w-full flex-1 px-4 py-4 md:px-6 md:py-8",
          narrow ? "max-w-xl" : "max-w-5xl",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
