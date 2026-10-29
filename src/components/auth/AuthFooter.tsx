"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { TextButton, TextLink } from "@/components/ui/TextLink";

/** Language switch + back-office link under the login card. */
export function AuthFooter() {
  const { t, toggleLang } = useI18n();
  return (
    <div className="flex justify-center gap-4 font-extrabold text-paper text-shadow-ink-1">
      <TextButton onRed onClick={toggleLang}>
        {t.auth.otherLang}
      </TextButton>
      <TextLink onRed href="/admin">
        {t.nav.admin}
      </TextLink>
    </div>
  );
}
