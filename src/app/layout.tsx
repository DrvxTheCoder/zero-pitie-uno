import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ArenaBackground } from "@/components/layout/ArenaBackground";
import { GrainTexture } from "@/components/layout/GrainTexture";
import { PressSound } from "@/components/layout/PressSound";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { getLang } from "@/lib/i18n/server";
import { bowlby, rubik, rubikDirt } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zéro Pitié League",
  description: "Classement de vos parties d'UNO No Mercy : chrono de 5 minutes, saisons de 30 jours, plusieurs ligues.",
  applicationName: "Zéro Pitié",
  appleWebApp: { capable: true, title: "Zéro Pitié" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#d41e24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${bowlby.variable} ${rubikDirt.variable} ${rubik.variable}`}>
      <body className="min-h-dvh overflow-x-hidden bg-red pr-[max(16px,env(safe-area-inset-right,0px))] pb-[env(safe-area-inset-bottom,0px)] pl-[max(16px,env(safe-area-inset-left,0px))] font-body text-[15px] leading-[1.4] text-ink">
        <I18nProvider initialLang={lang}>
          <ToastProvider>
            <GrainTexture />
            <ArenaBackground />
            {children}
          </ToastProvider>
        </I18nProvider>
        <ServiceWorkerRegister />
        <PressSound />
      </body>
    </html>
  );
}
