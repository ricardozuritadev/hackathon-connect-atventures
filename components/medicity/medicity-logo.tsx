import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type MedicityLogoProps = {
  className?: string;
  href?: string;
};

export function MedicityLogo({
  className,
  href = "/",
}: MedicityLogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label="Medicity inicio"
    >
      <span className="text-2xl font-bold leading-8 text-medicity-blue">
        Medicity
      </span>
      <Image
        src="/medicity/brand-dots.svg"
        alt=""
        width={30}
        height={30}
        className="size-[30px]"
        unoptimized
      />
    </Link>
  );
}
