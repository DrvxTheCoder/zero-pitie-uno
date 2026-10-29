"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { Panel } from "@/components/ui/Panel";
import { SEASON_DAYS } from "@/lib/constants";
import { seasonProgress } from "@/lib/seasons";
import { cn } from "@/lib/utils";

/** "SAISON 3 · J-11" with 30 day-segments (elapsed yellow, today blinking red). */
export function SeasonBanner({ leagueCreatedAt, now }: { leagueCreatedAt: number; now: number }) {
  const { t } = useI18n();
  const s = seasonProgress(now, leagueCreatedAt);
  const fmt = (ts: number) => new Date(ts).toLocaleDateString(t.locale, { day: "numeric", month: "short" });

  return (
    <Panel stack>
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <h1 className="m-0 font-display text-[clamp(30px,7vw,44px)] leading-[.9] font-normal uppercase">
          {t.season.title} <em className="text-red not-italic text-stroke-2">{s.index + 1}</em>
        </h1>
        <span className="rotate-2 rounded-[10px] bg-ink px-2.5 py-1.5 font-display text-[14px] text-yellow uppercase">
          {t.season.daysLeft(s.daysLeft)}
        </span>
      </div>
      <div aria-hidden className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px]">
        {Array.from({ length: SEASON_DAYS }, (_, day) => (
          <i
            key={day}
            className={cn(
              "h-[14px] rounded-[3px] border-2 border-ink",
              day < s.dayNumber && "bg-yellow",
              day === s.dayNumber && "animate-blink-seg bg-red",
              day > s.dayNumber && "bg-paper",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[12px] font-semibold text-muted">
        <span>
          {t.season.starts} {fmt(s.start)}
        </span>
        <span>
          {t.season.ends} {fmt(s.end - 1)}
        </span>
      </div>
    </Panel>
  );
}
