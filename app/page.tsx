import { Suspense } from "react";

import { LoadingFallback } from "@/components/treatments/loading-fallback";
import { HomePageClient } from "@/components/medicity/home-page-client";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageClient />
    </Suspense>
  );
}
