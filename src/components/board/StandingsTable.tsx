"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { Avatar, DiffBadge, StreakBadge } from "@/components/ui/Badges";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { Tape } from "@/components/ui/Tape";
import { playerColor, winRate, type Standing } from "@/lib/stats";
import type { PlayerDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export type Scope = "season" | "all";

function StandingRow({ s, rank, lead, color }: { s: Standing; rank: number; lead: boolean; color: string }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "grid grid-cols-[28px_38px_minmax(0,1fr)_auto_auto] items-center gap-2.5 rounded-[12px] border-3 border-ink px-2.5 py-2 shadow-ink-3",
        "max-[420px]:grid-cols-[24px_34px_minmax(0,1fr)_auto] max-[420px]:gap-2",
        lead ? "bg-yellow" : "bg-paper",
        !s.player.active && "opacity-60",
      )}
    >
      <span className="text-center font-display text-[17px]">{rank}</span>
      <Avatar name={s.player.name} color={color} className="max-[420px]:size-[34px]" />
      <span className="min-w-0">
        <b className="block truncate text-base font-extrabold">
          {s.player.name}
          <StreakBadge streak={s.streak} winLetter={t.board.winShort} lossLetter={t.board.lossShort} />
        </b>
        <span className={cn("block text-[12px] font-semibold", lead ? "text-ink" : "text-muted")}>
          {t.board.games(s.games)} · {winRate(s)}% {t.board.winRate}
        </span>
      </span>
      <span className="text-[13px] font-extrabold whitespace-nowrap tabular-nums max-[420px]:hidden">
        <span className="text-green">{s.wins}</span>–<span className="text-red">{s.losses}</span>
      </span>
      <DiffBadge value={s.diff} />
    </div>
  );
}

export function StandingsTable({
  standings,
  players,
  scope,
  onScopeChange,
  seasonNumber,
}: {
  standings: Standing[];
  players: PlayerDTO[];
  scope: Scope;
  onScopeChange: (s: Scope) => void;
  seasonNumber: number;
}) {
  const { t } = useI18n();
  return (
    <section className="grid min-w-0 gap-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Tape>{t.board.title}</Tape>
        <SegmentedToggle
          value={scope}
          onChange={onScopeChange}
          options={[
            { value: "season", label: `${t.board.scopeSeason} ${seasonNumber}` },
            { value: "all", label: t.board.scopeAll },
          ]}
        />
      </div>
      <div className="grid gap-2">
        {standings.map((s, i) => (
          <StandingRow
            key={s.player.id}
            s={s}
            rank={i + 1}
            lead={i === 0 && s.games > 0}
            color={playerColor(players, s.player.id)}
          />
        ))}
      </div>
    </section>
  );
}
