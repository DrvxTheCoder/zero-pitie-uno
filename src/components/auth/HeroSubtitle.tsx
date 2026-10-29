"use client";

import { useI18n } from "@/components/providers/I18nProvider";

export function HeroSubtitle() {
  const { t } = useI18n();
  return <p className="m-0 text-base font-extrabold text-paper text-shadow-ink-2">{t.auth.heroSub}</p>;
}
