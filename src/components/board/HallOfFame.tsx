"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { DiffBadge } from "@/components/ui/Badges";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import { seasonRange } from "@/lib/seasons";
import { pastChampions } from "@/lib/stats";
import type { GameDTO, PlayerDTO } from "@/lib/types";

/** Champion of each finished season ("Palmarès"). */
export function HallOfFame({
  games,
  players,
  leagueCreatedAt,
  currentSeason,
}: {
  games: GameDTO[];
  players: PlayerDTO[];
  leagueCreatedAt: number;
  currentSeason: number;
}) {
  const { t } = useI18n();
  const champions = pastChampions(games, players, leagueCreatedAt, currentSeason);
  const firstTitleDate = new Date(seasonRange(currentSeason, leagueCreatedAt)[1] - 1).toLocaleDateString(t.locale, {
    day: "numeric",
    month: "long",
  });

  return (
    <Panel stack="gap-2.5">
      <Tape>{t.board.hallOfFame}</Tape>
      {champions.length ? (
        <div>
          {champions.map(({ seasonIndex, standing }) => (
            <div
              key={seasonIndex}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 border-t-2 border-dashed border-line py-2 first:border-t-0"
            >
              <span className="rounded-[6px] bg-ink px-[7px] py-[3px] font-display text-[12px] text-yellow">S{seasonIndex + 1}</span>
              <b className="truncate">{standing.player.name}</b>
              <DiffBadge value={standing.diff} />
            </div>
          ))}
        </div>
      ) : (
        <span className="text-[13px] text-muted">{t.board.noChampion(firstTitleDate)}</span>
      )}
    </Panel>
  );
}
