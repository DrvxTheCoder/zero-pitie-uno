"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Input } from "@/components/ui/Form";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import type { AdminOverview } from "@/lib/server/queries";
import { signed } from "@/lib/utils";

const th = "border-b-2 border-line bg-ink px-2.5 py-2 text-left font-display text-[12px] font-normal tracking-[.04em] whitespace-nowrap text-paper uppercase";
const td = "border-b-2 border-line px-2.5 py-2 text-left whitespace-nowrap";

/** Every player across leagues, searchable by player or league name. */
export function PlayersTable({ data }: { data: AdminOverview }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const leagueName = (id: string) => data.leagues.find((l) => l.id === id)?.name ?? "?";
    const q = query.trim().toLowerCase();
    return data.players
      .map((p) => {
        const wins = data.games.filter((g) => g.winnerId === p.id).length;
        const losses = data.games.filter((g) => g.loserId === p.id).length;
        return { ...p, league: leagueName(p.leagueId), wins, losses };
      })
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.league.toLowerCase().includes(q))
      .sort((a, b) => a.league.localeCompare(b.league) || a.name.localeCompare(b.name));
  }, [data, query]);

  return (
    <Panel stack>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Tape>
          {t.admin.allPlayers} · {data.players.length}
        </Tape>
      </div>
      <Input id="admQ" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.admin.search} autoComplete="off" />
      <div className="overflow-x-auto rounded-[12px] border-3 border-ink">
        <table className="w-full min-w-[520px] border-collapse bg-paper text-[14px]">
          <thead>
            <tr>
              <th className={th}>{t.admin.colName}</th>
              <th className={th}>{t.admin.colLeague}</th>
              <th className={th}>{t.admin.colStatus}</th>
              <th className={`${th} text-right`}>{t.board.winShort}</th>
              <th className={`${th} text-right`}>{t.board.lossShort}</th>
              <th className={`${th} text-right`}>+/−</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className={td}>
                  <b>{p.name}</b>
                </td>
                <td className={td}>{p.league}</td>
                <td className={td}>{p.active ? t.admin.statusActive : t.admin.statusArchived}</td>
                <td className={`${td} text-right tabular-nums`}>{p.wins}</td>
                <td className={`${td} text-right tabular-nums`}>{p.losses}</td>
                <td className={`${td} text-right tabular-nums`}>
                  <b>{signed(p.wins - p.losses)}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
