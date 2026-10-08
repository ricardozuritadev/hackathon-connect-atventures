"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { MedicityLogo } from "@/components/medicity/medicity-logo";
import { MobileNavDrawer } from "@/components/medicity/mobile-nav-drawer";

const DESKTOP_NAV: {
  href: string | null;
  label: string;
  active?: boolean;
}[] = [
  { href: null, label: "OFERTAS" },
  { href: "/treatments", label: "MIS TRATAMIENTOS", active: true },
  { href: null, label: "SMARTCLUB" },
  { href: null, label: "MUNDO INFANTIL" },
];

export function MedicityHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white">
        <div className="flex h-7 items-center justify-center bg-medicity-blue px-4 md:h-8">
          <p className="text-[11px] text-white md:text-sm">
            Envío gratis en compras desde $60
          </p>
        </div>

        {/* Mobile header */}
        <div className="md:hidden">
          <div className="flex h-[52px] items-center px-4">
            <button
              type="button"
              className="size-6 shrink-0"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Image
                src="/medicity/icon-menu.svg"
                alt=""
                width={24}
                height={24}
                unoptimized
              />
            </button>
            <div className="ml-3.5">
              <MedicityLogo />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Image
                src="/medicity/icon-user.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
                unoptimized
              />
              <Image
                src="/medicity/icon-cart.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
                unoptimized
              />
            </div>
          </div>
          <div className="px-4 pb-2">
            <div
              className="flex h-10 items-center justify-between rounded-[20px] border border-border-default px-3.5"
              role="search"
            >
              <span className="text-sm text-text-secondary">
                ¿Qué estás buscando?
              </span>
              <Image
                src="/medicity/icon-search.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden h-20 items-center gap-8 px-14 md:flex">
          <MedicityLogo />
          <nav className="flex flex-1 items-center gap-7" aria-label="Principal">
            {DESKTOP_NAV.map((item) => {
              const className = [
                "text-sm font-bold whitespace-nowrap",
                item.active ? "text-medicity-blue" : "text-text-secondary",
              ].join(" ");

              if (item.href) {
                return (
                  <Link key={item.label} href={item.href} className={className}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <span
                  key={item.label}
                  className={`${className} cursor-default opacity-70`}
                  title="Disponible en evolución (demo)"
                >
                  {item.label}
                </span>
              );
            })}
          </nav>
          <div
            className="flex h-11 w-[270px] items-center justify-between rounded-full border border-border-default px-4"
            role="search"
          >
            <span className="text-base text-text-secondary">Buscar</span>
            <Image
              src="/medicity/icon-search.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden
              unoptimized
            />
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/medicity/icon-user.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden
              unoptimized
            />
            <Image
              src="/medicity/icon-cart.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden
              unoptimized
            />
          </div>
        </div>
      </header>

      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
