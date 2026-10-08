import type { Metadata } from "next";

import { PrescriptionExtractClient } from "@/components/prescriptions/prescription-extract-client";

export const metadata: Metadata = {
  title: "Digitalizar receta",
  description:
    "Sube una fotografía de tu receta y Mis Tratamientos identificará automáticamente los medicamentos y sus indicaciones.",
};

export default function PrescriptionExtractPage() {
  return <PrescriptionExtractClient />;
}
