"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/components/game/GameProvider";
import { PlayIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import { gamesInSeason, seasonIndex } from "@/lib/seasons";
import type { GameDTO, LeagueSnapshot } from "@/lib/types";
import { startOfDay } from "@/lib/utils";
import { HistoryDay } from "./HistoryDay";
import { SeasonSelect, type SeasonFilter } from "./SeasonSelect";

/** Max number of days rendered at once. */
const MAX_DAYS = 40;

export function HistoryView({ snapshot }: { snapshot: LeagueSnapshot }) {
  const { league, players, games } = snapshot;
  const { t } = useI18n();
  const { start } = useGame();
  const current = seasonIndex(Date.now(), league.createdAt);
  const [filter, setFilter] = useState<SeasonFilter>("current");

  const list = useMemo(() => {
    const idx = filter === "all" ? null : filter === "current" ? current : filter;
    const pool = idx === null ? games : gamesInSeason(games, idx, league.createdAt);
    return [...pool].sort((a, b) => b.playedAt - a.playedAt);
  }, [filter, current, games, league.createdAt]);

  const days = useMemo(() => {
    const groups = new Map<number, GameDTO[]>();
    for (const g of list) {
      const day = startOfDay(g.playedAt);
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day)!.push(g);
    }
    return [...groups].slice(0, MAX_DAYS);
  }, [list]);

  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? "?";

  return (
    <div className="mx-auto grid max-w-[720px] min-w-0 gap-[18px]">
      <Panel stack>
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Tape>{t.history.title}</Tape>
          <SeasonSelect value={filter} onChange={setFilter} currentSeason={current} />
        </div>
        <span className="text-[13px] text-muted">{t.board.games(list.length)}</span>
      </Panel>

      {list.length ? (
        days.map(([day, dayGames]) => <HistoryDay key={day} day={day} games={dayGames} nameOf={nameOf} />)
      ) : (
        <EmptyState
          title={t.history.empty}
          action={
            <Button variant="yellow" onClick={start}>
              <PlayIcon />
              {t.game.start}
            </Button>
          }
        />
      )}
    </div>
  );
}
