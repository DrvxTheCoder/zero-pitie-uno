"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import type { GameDTO } from "@/lib/types";
import { startOfDay } from "@/lib/utils";

/** "14:05  Fatou bat Moussa" lines (time for today, date otherwise). */
export function GameFeed({ games, nameOf, now }: { games: GameDTO[]; nameOf: (id: string) => string; now: number }) {
  const { t } = useI18n();
  const today = startOfDay(now);
  const when = (ts: number) =>
    ts >= today
      ? new Date(ts).toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" })
      : new Date(ts).toLocaleDateString(t.locale, { day: "numeric", month: "short" });

  return (
    <div className="grid">
      {games.map((g) => (
        <div
          key={g.id}
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 border-t-2 border-dashed border-line py-[9px] first:border-t-0"
        >
          <time className="min-w-[42px] text-[12px] font-extrabold text-muted tabular-nums">{when(g.playedAt)}</time>
          <span className="min-w-0 truncate text-[14px] font-semibold">
            <b className="font-extrabold text-green">{nameOf(g.winnerId)}</b> {t.board.beat}{" "}
            <i className="font-extrabold text-red not-italic">{nameOf(g.loserId)}</i>
          </span>
          <span />
        </div>
      ))}
    </div>
  );
}
