"use client";

import { useMemo, useState } from "react";
import { PlayCard } from "@/components/board/PlayCard";
import { MainGrid, Stack } from "@/components/layout/AppShell";
import { useI18n } from "@/components/providers/I18nProvider";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import { gamesInSeason, seasonIndex } from "@/lib/seasons";
import { computeStandings, playerColor } from "@/lib/stats";
import type { LeagueSnapshot, PlayerDTO } from "@/lib/types";
import { AddPlayerForm } from "./AddPlayerForm";
import { PlayerRow, type PlayerSummary } from "./PlayerRow";

export function PlayersView({ snapshot }: { snapshot: LeagueSnapshot }) {
  const { league, players, games } = snapshot;
  const { t } = useI18n();
  const [editing, setEditing] = useState<string | null>(null);

  const summaries = useMemo(() => {
    const all = computeStandings(games, players);
    const season = computeStandings(gamesInSeason(games, seasonIndex(Date.now(), league.createdAt), league.createdAt), players);
    const map = new Map<string, PlayerSummary>();
    for (const p of players) {
      const a = all.find((s) => s.player.id === p.id);
      const c = season.find((s) => s.player.id === p.id);
      map.set(p.id, { seasonDiff: c?.diff ?? 0, allTimeDiff: a?.diff ?? 0, games: a?.games ?? 0 });
    }
    return map;
  }, [games, players, league.createdAt]);

  const byName = (a: PlayerDTO, b: PlayerDTO) => a.name.localeCompare(b.name);
  const active = players.filter((p) => p.active).sort(byName);
  const archived = players.filter((p) => !p.active).sort(byName);

  const rows = (list: PlayerDTO[]) =>
    list.map((p) => (
      <PlayerRow
        key={p.id}
        player={p}
        color={playerColor(players, p.id)}
        summary={summaries.get(p.id)!}
        editing={editing === p.id}
        onEdit={() => setEditing(p.id)}
        onDoneEditing={() => setEditing(null)}
      />
    ));

  return (
    <MainGrid>
      <Stack>
        <AddPlayerForm />
        <Panel stack="gap-1.5">
          <Tape>
            {t.players.active} · {active.length}
          </Tape>
          <div>{active.length ? rows(active) : <p className="my-4 text-muted">{t.board.noPlayersSub}</p>}</div>
        </Panel>
        {archived.length > 0 && (
          <Panel stack="gap-1.5">
            <Tape>
              {t.players.archived} · {archived.length}
            </Tape>
            <div>{rows(archived)}</div>
          </Panel>
        )}
      </Stack>
      <Stack>
        <Panel>
          <p className="m-0 text-[13px]">{t.players.help}</p>
        </Panel>
        <PlayCard />
      </Stack>
    </MainGrid>
  );
}
