import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { ProfileForm } from "@/components/treatments/register/profile-form";

export const metadata: Metadata = {
  title: "Perfil",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProfileForm />
    </Suspense>
  );
}
