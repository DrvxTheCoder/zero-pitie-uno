"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { renamePlayer, setPlayerActive } from "@/app/actions/players";
import { CloseIcon, PenIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Avatar } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Form";
import { NAME_MAX } from "@/lib/constants";
import type { PlayerDTO } from "@/lib/types";
import { signed } from "@/lib/utils";

export type PlayerSummary = { seasonDiff: number; allTimeDiff: number; games: number };

export function PlayerRow({
  player,
  color,
  summary,
  editing,
  onEdit,
  onDoneEditing,
}: {
  player: PlayerDTO;
  color: string;
  summary: PlayerSummary;
  editing: boolean;
  onEdit: () => void;
  onDoneEditing: () => void;
}) {
  const { t } = useI18n();
  const toast = useToast();
  const [name, setName] = useState(player.name);
  const [pending, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setName(player.name);
      requestAnimationFrame(() => input.current?.select());
    }
  }, [editing, player.name]);

  function rename(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await renamePlayer(player.id, name);
      if (!res.ok) return toast(t.errors[res.error], "bad");
      onDoneEditing();
    });
  }

  function toggleActive() {
    startTransition(async () => {
      const res = await setPlayerActive(player.id, !player.active);
      if (!res.ok) toast(t.errors[res.error], "bad");
    });
  }

  return (
    <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 border-t-2 border-dashed border-line py-2.5 first:border-t-0">
      <Avatar name={player.name} color={color} />

      {editing ? (
        <form onSubmit={rename} className="flex min-w-0 gap-1.5">
          <Input
            ref={input}
            id={`rn-${player.id}`}
            density="sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX}
            required
          />
          <Button type="submit" size="sm" variant="yellow" disabled={pending}>
            OK
          </Button>
        </form>
      ) : (
        <span className="min-w-0">
          <b className="block truncate text-base font-extrabold">{player.name}</b>
          <span className="block text-[12px] font-semibold text-muted">
            {t.board.scopeSeason} {signed(summary.seasonDiff)} · {t.board.scopeAll} {signed(summary.allTimeDiff)} ·{" "}
            {t.board.games(summary.games)}
          </span>
        </span>
      )}

      <span className="flex flex-wrap justify-end gap-1.5">
        {editing ? (
          <Button size="sm" onClick={onDoneEditing} aria-label={t.game.cancel}>
            <CloseIcon />
          </Button>
        ) : (
          <>
            <Button size="sm" onClick={onEdit} aria-label={t.players.rename}>
              <PenIcon />
            </Button>
            <Button size="sm" onClick={toggleActive} disabled={pending}>
              {player.active ? t.players.archive : t.players.restore}
            </Button>
          </>
        )}
      </span>
    </div>
  );
}
