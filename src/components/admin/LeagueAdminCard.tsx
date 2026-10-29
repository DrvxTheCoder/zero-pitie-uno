"use client";

import { useState, useTransition, type FormEvent } from "react";
import { adminDeleteLeague, adminDeletePlayer, adminSetLeaguePassword } from "@/app/actions/admin";
import { CloseIcon, TrashIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Chip";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Input } from "@/components/ui/Form";
import { PASSWORD_MIN } from "@/lib/constants";
import { seasonProgress } from "@/lib/seasons";
import { computeStandings } from "@/lib/stats";
import type { GameDTO, LeagueDTO, PlayerDTO } from "@/lib/types";
import { signed } from "@/lib/utils";

type Props = {
  league: LeagueDTO & { playerCount: number; gameCount: number };
  players: PlayerDTO[];
  games: GameDTO[];
};

/** Removable player pill; two taps to delete (also deletes their games). */
function PlayerPill({ player }: { player: PlayerDTO }) {
  const { t } = useI18n();
  const toast = useToast();
  const [armed, setArmed] = useState(false);
  const [, startTransition] = useTransition();

  function click() {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 3000);
      return;
    }
    startTransition(async () => {
      const res = await adminDeletePlayer(player.id);
      toast(res.ok ? t.admin.playerDeleted : t.errors[res.error], res.ok ? "ok" : "bad");
    });
  }

  return (
    <span
      className={
        "inline-flex max-w-full items-center gap-1 rounded-[8px] border-2 border-ink px-2 py-0.5 text-[13px] font-extrabold " +
        (armed ? "bg-ink text-yellow" : player.active ? "bg-paper" : "bg-line")
      }
    >
      <span className="truncate">{armed ? t.common.sure : player.name}</span>
      <button type="button" onClick={click} aria-label={`${t.admin.remove} ${player.name}`} className="inline-flex border-0 bg-transparent p-0">
        <CloseIcon width={14} height={14} />
      </button>
    </span>
  );
}

function PasswordForm({ leagueId }: { leagueId: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await adminSetLeaguePassword(leagueId, value);
      if (!res.ok) return toast(t.errors[res.error], "bad");
      toast(t.admin.passwordChanged);
      setValue("");
    });
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-[1_1_220px] gap-1.5">
      <Input
        id={`ap-${leagueId}`}
        density="xs"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t.admin.newPassword}
        minLength={PASSWORD_MIN}
        required
        autoComplete="off"
      />
      <Button type="submit" size="sm" disabled={pending}>
        {t.admin.change}
      </Button>
    </form>
  );
}

export function LeagueAdminCard({ league, players, games }: Props) {
  const { t } = useI18n();
  const toast = useToast();
  const [, startTransition] = useTransition();

  const season = seasonProgress(Date.now(), league.createdAt);
  const leader = computeStandings(
    games.filter((g) => g.playedAt >= season.start && g.playedAt < season.end),
    players,
  ).find((s) => s.games > 0);

  const remove = () =>
    startTransition(async () => {
      const res = await adminDeleteLeague(league.id);
      toast(res.ok ? t.admin.leagueDeleted : t.errors[res.error], res.ok ? "ok" : "bad");
    });

  return (
    <div className="grid gap-2.5 rounded-[14px] border-3 border-ink bg-paper p-3">
      <div className="min-w-0">
        <b className="font-display text-[18px] leading-[1.1] uppercase">{league.name}</b>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Tag>
            {t.admin.created} {new Date(league.createdAt).toLocaleDateString(t.locale, { day: "numeric", month: "short", year: "numeric" })}
          </Tag>
          <Tag>{t.admin.playersCount(league.playerCount)}</Tag>
          <Tag>{t.board.games(league.gameCount)}</Tag>
          <Tag>
            {t.season.title} {season.index + 1}
          </Tag>
          {leader && (
            <Tag tone="yellow">
              {t.admin.leading} : {leader.player.name} {signed(leader.diff)}
            </Tag>
          )}
        </div>
      </div>

      {players.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {players.map((p) => (
            <PlayerPill key={p.id} player={p} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <PasswordForm leagueId={league.id} />
        <ConfirmButton size="sm" variant="red" onConfirm={remove}>
          <TrashIcon />
          {t.admin.deleteLeague}
        </ConfirmButton>
      </div>
    </div>
  );
}
