"use client";

import {
  Camera,
  ChevronLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Smile,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useTreatmentDemo } from "@/components/treatments/treatment-demo-provider";

type WhatsAppSimScreenProps = {
  treatmentId: string;
};

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function WhatsAppSimScreen({ treatmentId }: WhatsAppSimScreenProps) {
  const router = useRouter();
  const { hydrated, getTreatment } = useTreatmentDemo();
  const treatment = getTreatment(treatmentId);

  const medicationName = useMemo(() => {
    const name = treatment?.medicationName?.trim();
    return name && name.length > 0 ? name : "tu medicamento";
  }, [treatment?.medicationName]);

  const messageTime = useMemo(() => formatMessageTime(new Date()), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!treatment) {
      router.replace("/treatments");
    }
  }, [hydrated, treatment, router]);

  if (!hydrated || !treatment) {
    return (
      <div className="flex h-dvh max-h-dvh items-center justify-center bg-[#0b141a] text-sm text-white/70">
        Cargando…
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-[#0b141a] text-white">
      <header className="flex shrink-0 items-center gap-1 bg-[#075e54] px-1 pt-[env(safe-area-inset-top)] pb-2 shadow-md">
        <Link
          href="/treatments"
          className="flex items-center gap-0.5 rounded-full p-2 text-white"
          aria-label="Volver a Mis tratamientos"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </Link>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-sm font-bold text-[#075e54]"
          aria-hidden
        >
          MT
        </div>
        <div className="min-w-0 flex-1 px-2">
          <p className="truncate text-[17px] font-medium leading-tight">
            Mis Tratamientos
          </p>
          <p className="truncate text-xs text-white/80">en línea</p>
        </div>
        <div className="flex shrink-0 items-center pr-1 text-white">
          <button
            type="button"
            className="rounded-full p-2"
            tabIndex={-1}
            aria-hidden
          >
            <Video className="size-5" />
          </button>
          <button
            type="button"
            className="rounded-full p-2"
            tabIndex={-1}
            aria-hidden
          >
            <Phone className="size-5" />
          </button>
          <button
            type="button"
            className="rounded-full p-2"
            tabIndex={-1}
            aria-hidden
          >
            <MoreVertical className="size-5" />
          </button>
        </div>
      </header>

      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
        style={{
          backgroundColor: "#0b141a",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.025) 0 1px, transparent 1px)",
          backgroundSize: "28px 28px, 36px 36px",
        }}
      >
        <div className="flex flex-1 flex-col justify-end gap-2 overflow-y-auto px-3 py-4">
          <article
            className="max-w-[88%] self-start rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 shadow-sm"
            aria-label="Mensaje de Mis Tratamientos"
          >
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#e9edef]">
              {`Hola, Ana 👋\n\nTu medicamento ${medicationName} está por terminarse.\n\n💊 Puedes revisarlo en Mis tratamientos y volver a comprarlo fácilmente.`}
            </p>
            <p className="mt-2">
              <Link
                href="/treatments"
                className="text-[15px] font-medium text-[#53bdeb] underline-offset-2 hover:underline"
              >
                👉 Ver mis tratamientos
              </Link>
            </p>
            <p className="mt-1 text-right text-[11px] text-[#8696a0]">
              {messageTime}
            </p>
          </article>
        </div>
      </div>

      <footer className="flex shrink-0 items-end gap-2 bg-[#0b141a] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex min-h-11 flex-1 items-center gap-2 rounded-full bg-[#1f2c34] px-3 py-2">
          <Smile className="size-5 shrink-0 text-[#8696a0]" aria-hidden />
          <input
            type="text"
            disabled
            placeholder="Mensaje"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#e9edef] placeholder:text-[#8696a0] outline-none disabled:cursor-default"
            aria-label="Mensaje"
          />
          <Paperclip className="size-5 shrink-0 text-[#8696a0]" aria-hidden />
          <Camera className="size-5 shrink-0 text-[#8696a0]" aria-hidden />
        </div>
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white"
          tabIndex={-1}
          aria-hidden
        >
          <Mic className="size-5" />
        </button>
      </footer>
    </div>
  );
}
