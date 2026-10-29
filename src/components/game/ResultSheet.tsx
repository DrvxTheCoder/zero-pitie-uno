"use client";

import { useState, useTransition, type FormEvent } from "react";
import { recordGame } from "@/app/actions/games";
import { SwapIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { ErrorBox } from "@/components/ui/Form";
import { Select } from "@/components/ui/Select";
import type { PlayerDTO } from "@/lib/types";
import { clock, cn } from "@/lib/utils";

function PlayerPick({
  id,
  label,
  tone,
  value,
  onChange,
  players,
  placeholder,
}: {
  id: string;
  label: string;
  tone: "win" | "lose";
  value: string;
  onChange: (v: string) => void;
  players: PlayerDTO[];
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      <span
        id={`${id}Label`}
        className={cn(
          "-rotate-2 justify-self-start rounded-[9px] border-3 border-ink px-2.5 pt-[3px] pb-0.5 font-display text-[14px] text-paper uppercase text-shadow-ink-2",
          tone === "win" ? "bg-green" : "bg-red",
        )}
      >
        {label}
      </span>
      <Select
        id={id}
        aria-labelledby={`${id}Label`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={players.map((p) => ({ value: p.id, label: p.name }))}
      />
    </div>
  );
}

/** "Qui a gagné ?" — pick winner (+1) and loser (−1) from the active players. */
export function ResultSheet({
  players,
  durationS,
  onCancel,
  onSaved,
}: {
  players: PlayerDTO[];
  /** Seconds played; 0 hides the duration (entry without timer). */
  durationS: number;
  onCancel: () => void;
  onSaved: (winnerName: string, loserName: string) => void;
}) {
  const { t } = useI18n();
  const [winner, setWinner] = useState("");
  const [loser, setLoser] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!winner || !loser) return setError(t.game.pickBoth);
    if (winner === loser) return setError(t.game.samePlayer);
    startTransition(async () => {
      const res = await recordGame(winner, loser, durationS);
      if (!res.ok) return setError(t.errors[res.error]);
      const name = (id: string) => players.find((p) => p.id === id)?.name ?? "?";
      onSaved(name(winner), name(loser));
    });
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative z-5 grid max-h-full w-[min(520px,100%)] animate-rise gap-4 overflow-auto rounded-[22px] border-3 border-ink bg-paper p-5 shadow-ink-9"
    >
      <div>
        <h2 className="m-0 font-display text-[28px] leading-none font-normal uppercase">{t.game.result}</h2>
        <span className="text-[13px] text-muted">
          {t.game.resultSub}
          {durationS > 0 && ` · ${t.game.duration} ${clock(durationS)}`}
        </span>
      </div>

      <PlayerPick id="rWin" tone="win" label={t.game.winner} value={winner} onChange={setWinner} players={players} placeholder={t.game.choose} />

      <div className="-my-1.5 flex justify-center">
        <Button
          size="sm"
          onClick={() => {
            setWinner(loser);
            setLoser(winner);
          }}
        >
          <SwapIcon />
          {t.game.swap}
        </Button>
      </div>

      <PlayerPick id="rLose" tone="lose" label={t.game.loser} value={loser} onChange={setLoser} players={players} placeholder={t.game.choose} />

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="flex flex-wrap gap-2.5">
        <Button onClick={onCancel}>{t.game.cancel}</Button>
        <Button type="submit" variant="yellow" className="flex-1" disabled={pending}>
          {t.game.save}
        </Button>
      </div>
    </form>
  );
}
