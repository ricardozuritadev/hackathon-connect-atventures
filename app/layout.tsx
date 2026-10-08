import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";

import { TreatmentDemoProvider } from "@/components/treatments/treatment-demo-provider";

import "./globals.css";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mis Tratamientos | Medicity",
    template: "%s | Medicity",
  },
  description:
    "Mis Tratamientos digitaliza recetas médicas y simplifica la continuidad del tratamiento. Prototipo de demostración.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <TreatmentDemoProvider>{children}</TreatmentDemoProvider>
      </body>
    </html>
  );
}
