import Link from "next/link";

import { formatDisplayDate } from "@/lib/demo/fixtures";
import type { Treatment } from "@/lib/treatments/types";

type TreatmentListCardProps = {
  treatment: Treatment;
};

export function TreatmentListCard({ treatment }: TreatmentListCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[var(--radius-card)] border border-border-default bg-white">
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-medicity-blue" aria-hidden />
      <div className="px-4 py-3.5 pl-5">
        <h3 className="text-base font-bold text-text-primary">
          {treatment.medicationName}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          Próxima compra estimada:{" "}
          {formatDisplayDate(treatment.estimatedRefillDate)}
        </p>
        <p className="mt-2 text-xs text-medicity-blue">
          <Link href={`/treatments/${treatment.id}`} className="hover:underline">
            Ver detalles
          </Link>
          {"   ·   "}
          <Link
            href={`/treatments/${treatment.id}/repurchase`}
            className="hover:underline"
          >
            Comprar de nuevo
          </Link>
        </p>
      </div>
    </article>
  );
}
