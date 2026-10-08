import { cn } from "@/lib/utils";

type StepProgressProps = {
  /** 1-based current step */
  current: number;
  total?: number;
};

export function StepProgress({ current, total = 5 }: StepProgressProps) {
  return (
    <div
      className="flex w-full gap-1.5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Paso ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const filled = step <= current;
        return (
          <div
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full",
              filled ? "bg-medicity-blue" : "bg-border-default"
            )}
          />
        );
      })}
    </div>
  );
}
