import { formatMoney } from "@/lib/demo/fixtures";
import type { PricingSummary } from "@/lib/treatments/types";

type CopaySummaryProps = {
  pricing: PricingSummary;
};

export function CopaySummary({ pricing }: CopaySummaryProps) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border-default bg-white p-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Precio normal</span>
          <span>{formatMoney(pricing.normalPrice, pricing.currencyLabel)}</span>
        </div>
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Cobertura del seguro</span>
          <span>
            −{formatMoney(pricing.coverageAmount, pricing.currencyLabel)}
          </span>
        </div>
        <div className="flex justify-between border-t border-border-default pt-2 text-base font-bold text-text-primary">
          <span>Tu copago</span>
          <span>{formatMoney(pricing.copayAmount, pricing.currencyLabel)}</span>
        </div>
      </div>
    </div>
  );
}
