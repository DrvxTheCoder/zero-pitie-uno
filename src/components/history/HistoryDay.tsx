"use client";

import { useTransition } from "react";
import { deleteGame } from "@/app/actions/games";
import { TrashIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import type { GameDTO } from "@/lib/types";

function Pill({ name, tone }: { name: string; tone: "win" | "lose" }) {
  return (
    <span
      className={
        "inline-flex max-w-full items-center gap-1 rounded-[8px] border-2 border-ink px-2 py-0.5 text-[13px] font-extrabold text-paper " +
        (tone === "win" ? "bg-green" : "bg-red")
      }
    >
      <span className="truncate">{name}</span> {tone === "win" ? "+1" : "−1"}
    </span>
  );
}

function HistoryRow({ game, nameOf }: { game: GameDTO; nameOf: (id: string) => string }) {
  const { t } = useI18n();
  const toast = useToast();
  const [, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      const res = await deleteGame(game.id);
      toast(res.ok ? t.history.deleted : t.errors[res.error], res.ok ? "ok" : "bad");
    });

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-3 border-ink bg-paper px-2.5 py-2">
      <time className="text-[13px] font-extrabold tabular-nums">
        {new Date(game.playedAt).toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" })}
      </time>
      <span className="flex min-w-0 flex-wrap items-center gap-1.5">
        <Pill name={nameOf(game.winnerId)} tone="win" />
        <Pill name={nameOf(game.loserId)} tone="lose" />
      </span>
      <ConfirmButton size="sm" onConfirm={remove} aria-label={t.history.delete}>
        <TrashIcon />
      </ConfirmButton>
    </div>
  );
}

/** One day heading ("jeudi 29 octobre · 6 parties") and its games. */
export function HistoryDay({ day, games, nameOf }: { day: number; games: GameDTO[]; nameOf: (id: string) => string }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-1">
      <h3 className="mt-1.5 mb-0.5 font-display text-[14px] font-normal uppercase">
        {new Date(day).toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long" })} ·{" "}
        {t.board.games(games.length)}
      </h3>
      {games.map((g) => (
        <HistoryRow key={g.id} game={g} nameOf={nameOf} />
      ))}
    </div>
  );
}
