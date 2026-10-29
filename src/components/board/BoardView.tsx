"use client";

import { useEffect, useMemo, useState } from "react";
import { useGame } from "@/components/game/GameProvider";
import { PlayIcon } from "@/components/icons";
import { MainGrid, Stack } from "@/components/layout/AppShell";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button, buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TextButton } from "@/components/ui/TextLink";
import { gamesInSeason, seasonIndex } from "@/lib/seasons";
import { computeStandings } from "@/lib/stats";
import type { LeagueSnapshot } from "@/lib/types";
import Link from "next/link";
import { HallOfFame } from "./HallOfFame";
import { PlayCard } from "./PlayCard";
import { Podium } from "./Podium";
import { SeasonBanner } from "./SeasonBanner";
import { StandingsTable, type Scope } from "./StandingsTable";
import { TodayPanel } from "./TodayPanel";

export function BoardView({ snapshot }: { snapshot: LeagueSnapshot }) {
  const { league, players, games } = snapshot;
  const { t } = useI18n();
  const { start, quickEntry, savedAt } = useGame();
  const [scope, setScope] = useState<Scope>("season");
  const now = Date.now();
  const current = seasonIndex(now, league.createdAt);

  // After saving a game, show the season standings
  useEffect(() => {
    if (savedAt) setScope("season");
  }, [savedAt]);

  const standings = useMemo(
    () => computeStandings(scope === "season" ? gamesInSeason(games, current, league.createdAt) : games, players),
    [scope, games, players, current, league.createdAt],
  );
  const played = standings.filter((s) => s.games > 0);

  let main;
  if (players.length < 2) {
    main = (
      <EmptyState
        title={t.board.noPlayersTitle}
        subtitle={t.board.noPlayersSub}
        action={
          <Link href="/players" className={buttonClasses("yellow")}>
            {t.board.goPlayers}
          </Link>
        }
      />
    );
  } else {
    main = (
      <>
        {played.length ? (
          <Podium top={played.slice(0, 3)} />
        ) : (
          <EmptyState
            title={t.board.emptyTitle}
            subtitle={t.board.emptySub}
            action={
              <Button variant="yellow" onClick={start}>
                <PlayIcon />
                {t.game.start}
              </Button>
            }
          />
        )}
        <StandingsTable
          standings={standings}
          players={players}
          scope={scope}
          onScopeChange={setScope}
          seasonNumber={current + 1}
        />
      </>
    );
  }

  return (
    <MainGrid>
      <Stack>
        <SeasonBanner leagueCreatedAt={league.createdAt} now={now} />
        {main}
      </Stack>
      <Stack>
        <PlayCard />
        <TextButton onRed onClick={quickEntry} className="justify-self-start">
          {t.game.quick}
        </TextButton>
        <TodayPanel games={games} players={players} now={now} />
        <HallOfFame games={games} players={players} leagueCreatedAt={league.createdAt} currentSeason={current} />
      </Stack>
    </MainGrid>
  );
}
