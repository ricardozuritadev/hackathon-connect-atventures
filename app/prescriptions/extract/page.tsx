import { redirect } from "next/navigation";

/** Legacy route kept for compatibility; OCR lives in the registration flow. */
export default function PrescriptionExtractPage() {
  redirect("/treatments/register/prescription");
}
