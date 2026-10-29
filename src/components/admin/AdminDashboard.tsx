"use client";

import { MainGrid, Stack } from "@/components/layout/AppShell";
import { useI18n } from "@/components/providers/I18nProvider";
import { StatTile } from "@/components/ui/Badges";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import type { AdminOverview } from "@/lib/server/queries";
import { AdminHeader } from "./AdminHeader";
import { CreateLeagueForm } from "./CreateLeagueForm";
import { LeagueAdminCard } from "./LeagueAdminCard";
import { PlayersTable } from "./PlayersTable";

export function AdminDashboard({ data, hasLeagueSession }: { data: AdminOverview; hasLeagueSession: boolean }) {
  const { t } = useI18n();
  return (
    <>
      <AdminHeader hasLeagueSession={hasLeagueSession} />
      <MainGrid>
        <Stack>
          <Panel stack>
            <Tape size="sm">
              {t.admin.leagues} · {data.leagues.length}
            </Tape>
            {data.leagues.length ? (
              data.leagues.map((l) => (
                <LeagueAdminCard
                  key={l.id}
                  league={l}
                  players={data.players.filter((p) => p.leagueId === l.id)}
                  games={data.games.filter((g) => g.leagueId === l.id)}
                />
              ))
            ) : (
              <p className="my-4 text-muted">—</p>
            )}
          </Panel>
          <PlayersTable data={data} />
        </Stack>
        <Stack>
          <Panel>
            <div className="grid grid-cols-3 gap-2">
              <StatTile value={data.leagues.length} label={t.admin.leagues} />
              <StatTile value={data.players.length} label={t.admin.players} />
              <StatTile value={data.games.length} label={t.admin.games} />
            </div>
          </Panel>
          <CreateLeagueForm />
        </Stack>
      </MainGrid>
    </>
  );
}
