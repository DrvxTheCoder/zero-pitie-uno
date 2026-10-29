"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import type { Phase } from "@/lib/timer-phases";

/** "Tranquille…", "Ça chauffe !"… — re-mounted on each phase change so the pop animation replays. */
export function PhaseLabel({ phase }: { phase: Phase }) {
  const { t } = useI18n();
  return (
    <span
      key={phase}
      className="animate-pop bg-ink px-4 pt-1.5 pb-1 font-display text-[clamp(18px,5vw,28px)] text-paper uppercase shadow-yellow-4 [transform:rotate(-3deg)]"
    >
      {t.game.phases[phase]}
    </span>
  );
}
