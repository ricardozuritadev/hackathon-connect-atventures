"use client";

import Link from "next/link";
import { useEffect } from "react";

const MENU_ITEMS = [
  { href: "/", label: "⌂   Inicio", active: false },
  { href: "/treatments", label: "♡   Mis tratamientos", active: true },
  { href: null, label: "+   Medicamentos", active: false },
  { href: null, label: "%   Promociones", active: false },
  { href: null, label: "★   SmartClub", active: false },
  { href: null, label: "□   Mis pedidos", active: false },
  { href: null, label: "?   Ayuda y contacto", active: false },
] as const;

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      <nav className="absolute inset-y-0 left-0 flex h-dvh max-h-dvh w-[326px] max-w-[85vw] flex-col bg-white px-3.5 pt-[max(2rem,env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] shadow-xl">
        <p className="px-2 text-xs font-bold tracking-wide text-text-secondary uppercase">
          Menú
        </p>
        <ul className="mt-4 flex flex-col gap-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const className = [
              "block rounded-xl px-4 py-4 text-base font-medium",
              item.active
                ? "bg-medicity-blue-light text-medicity-blue"
                : "text-text-primary hover:bg-muted",
            ].join(" ");

            if (item.href) {
              return (
                <li key={item.label}>
                  <Link href={item.href} className={className} onClick={onClose}>
                    {item.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <button
                  type="button"
                  className={`${className} w-full cursor-default text-left opacity-60`}
                  disabled
                  title="Próximamente"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="mt-auto mb-8 px-2 py-3 text-left text-sm text-text-secondary"
          onClick={onClose}
        >
          Cerrar menú  ×
        </button>
      </nav>
    </div>
  );
}
