"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { setLanguage } from "@/app/actions/auth";
import { getDictionary, type Dictionary, type Lang } from "@/lib/i18n";

type I18nValue = { lang: Lang; t: Dictionary; toggleLang: () => void };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);

  const toggleLang = useCallback(() => {
    const next: Lang = lang === "fr" ? "en" : "fr";
    setLang(next);
    document.documentElement.lang = next;
    setLanguage(next).then(() => router.refresh());
  }, [lang, router]);

  const value = useMemo(() => ({ lang, t: getDictionary(lang), toggleLang }), [lang, toggleLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
