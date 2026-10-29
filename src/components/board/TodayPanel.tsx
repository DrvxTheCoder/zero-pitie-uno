"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { StatTile } from "@/components/ui/Badges";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import { TextLink } from "@/components/ui/TextLink";
import { computeStandings } from "@/lib/stats";
import type { GameDTO, PlayerDTO } from "@/lib/types";
import { signed, startOfDay } from "@/lib/utils";
import { GameFeed } from "./GameFeed";

/** Today's counters + the 6 latest games. */
export function TodayPanel({ games, players, now }: { games: GameDTO[]; players: PlayerDTO[]; now: number }) {
  const { t } = useI18n();
  const todays = games.filter((g) => g.playedAt >= startOfDay(now));
  const todayLeader = computeStandings(todays, players).find((s) => s.games > 0);
  const recent = [...games].sort((a, b) => b.playedAt - a.playedAt).slice(0, 6);
  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? "?";

  return (
    <Panel stack>
      <Tape>{t.board.today}</Tape>
      <div className="grid grid-cols-3 gap-2">
        <StatTile value={todays.length} label={t.board.gamesToday} />
        <StatTile value={todayLeader ? signed(todayLeader.diff) : "–"} label={todayLeader ? todayLeader.player.name : t.board.leader} />
        <StatTile value={players.filter((p) => p.active).length} label={t.board.players} />
      </div>
      {recent.length > 0 && (
        <>
          <Tape tone="yellow">
            {t.board.recent}
          </Tape>
          <GameFeed games={recent} nameOf={nameOf} now={now} />
          <TextLink href="/history" className="justify-self-start">
            {t.board.seeAll}
          </TextLink>
        </>
      )}
    </Panel>
  );
}
