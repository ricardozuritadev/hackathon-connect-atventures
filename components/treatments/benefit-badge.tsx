import { cn } from "@/lib/utils";

type BenefitBadgeProps = {
  label: string;
  className?: string;
};

export function BenefitBadge({ label, className }: BenefitBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-medicity-green/15 px-2.5 py-1 text-xs font-bold text-[#5a7a1f]",
        className
      )}
    >
      {label}
    </span>
  );
}
