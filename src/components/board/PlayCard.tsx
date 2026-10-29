"use client";

import { useGame } from "@/components/game/GameProvider";
import { PlayIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";

/** Big tilted yellow "DÉMARRER — Partie de 5 minutes" call to action. */
export function PlayCard() {
  const { t } = useI18n();
  const { start } = useGame();
  return (
    <button
      type="button"
      onClick={start}
      className={
        "relative grid w-full -rotate-[1.5deg] gap-1 rounded-[18px] border-3 border-ink bg-yellow px-[18px] pt-[18px] pb-4 text-left shadow-ink-6 " +
        "transition-[rotate,scale,translate] duration-[120ms] hover:rotate-0 hover:scale-[1.02] " +
        "active:translate-x-1 active:translate-y-1 active:scale-100 active:rotate-0 active:shadow-ink-2"
      }
    >
      <b className="font-display text-[32px] leading-[.95] uppercase">{t.game.start}</b>
      <span className="font-extrabold">{t.game.startSub}</span>
      <span className="absolute top-1/2 right-[14px] grid size-16 -translate-y-1/2 rotate-8 place-items-center rounded-full border-3 border-ink bg-ink text-yellow">
        <PlayIcon className="ml-1 size-[30px]" />
      </span>
    </button>
  );
}
