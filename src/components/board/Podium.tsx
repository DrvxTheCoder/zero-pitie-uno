"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import type { Standing } from "@/lib/stats";
import { cn, signed } from "@/lib/utils";
import { UnoCard } from "./UnoCard";

const PLACES = [
  { rank: 2, color: "var(--color-blue)", tilt: "-rotate-6" },
  { rank: 1, color: "var(--color-yellow)", tilt: "-translate-y-[10px]" },
  { rank: 3, color: "var(--color-green)", tilt: "rotate-6" },
] as const;

/** Top 3 of the season as cards, laid out 2 – 1 – 3. */
export function Podium({ top }: { top: Standing[] }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto grid w-full max-w-[500px] grid-cols-[1fr_1.15fr_1fr] items-end gap-[clamp(8px,2.5vw,18px)] px-1 pt-2.5 pb-1">
      {PLACES.map(({ rank, color, tilt }) => {
        const s = top[rank - 1];
        return (
          <div key={rank} className="grid min-w-0 justify-items-center gap-2.5">
            <UnoCard
              className={tilt}
              value={s ? signed(s.diff) : "?"}
              color={color}
              corner={s ? `#${rank}` : undefined}
              empty={!s}
            />
            <div className="grid max-w-full gap-0.5 text-center">
              <b className="max-w-full -rotate-2 truncate rounded-[6px] bg-ink px-2.5 pt-[3px] pb-0.5 font-display text-[clamp(13px,3.2vw,18px)] text-paper">
                {s ? s.player.name : "—"}
              </b>
              {s && (
                <span className={cn("text-[12px] font-extrabold text-paper tabular-nums text-shadow-ink-1")}>
                  {s.wins}
                  {t.board.winShort} · {s.losses}
                  {t.board.lossShort}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
