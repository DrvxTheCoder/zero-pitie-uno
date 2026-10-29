"use client";

import { PlayIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { GAME_MINUTES_MAX, GAME_MINUTES_MIN, GAME_MINUTES_QUICK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RollingDigits } from "./RollingDigits";

const stepClass =
  "grid size-[clamp(52px,14vw,72px)] shrink-0 place-items-center rounded-full border-3 border-ink bg-paper p-0 font-display text-[clamp(30px,8vw,42px)] leading-none shadow-ink-4 " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-40";

/** "Ready" stage: pick the game length (− m:ss +, quick chips), then "C'est parti". */
export function DurationPicker({
  minutes,
  onChange,
  onGo,
}: {
  minutes: number;
  onChange: (minutes: number) => void;
  onGo: () => void;
}) {
  const { t } = useI18n();
  return (
    <>
      <span className="animate-pop bg-ink px-4 pt-1.5 pb-1 font-display text-[clamp(18px,5vw,28px)] text-paper uppercase shadow-yellow-4 [transform:rotate(-3deg)]">
        {t.game.pickTitle}
      </span>

      <div className="flex items-center gap-[clamp(10px,3vw,24px)]">
        <button
          type="button"
          className={stepClass}
          onClick={() => onChange(minutes - 1)}
          disabled={minutes <= GAME_MINUTES_MIN}
          aria-label={t.game.less}
        >
          −
        </button>
        <div aria-hidden>
          <RollingDigits secondsLeft={minutes * 60} phase={0} paused size="picker" />
        </div>
        <output aria-live="polite" className="sr-only">
          {t.game.minutes(minutes)}
        </output>
        <button
          type="button"
          className={stepClass}
          onClick={() => onChange(minutes + 1)}
          disabled={minutes >= GAME_MINUTES_MAX}
          aria-label={t.game.more}
        >
          +
        </button>
      </div>

      <div role="group" aria-label={t.game.pickTitle} className="flex flex-wrap justify-center gap-2.5">
        {GAME_MINUTES_QUICK.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={m === minutes}
            onClick={() => onChange(m)}
            className={cn(
              "min-w-14 rounded-[12px] border-3 border-ink px-3 pt-2 pb-1.5 font-display text-[16px] shadow-ink-3",
              "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
              m === minutes ? "bg-ink text-yellow shadow-yellow-3" : "bg-paper",
            )}
          >
            {m}′
          </button>
        ))}
      </div>

      <Button variant="yellow" onClick={onGo} className="rounded-[18px]! px-8! py-4! text-[clamp(20px,5.5vw,28px)]! shadow-ink-6! active:shadow-none! [&_svg]:size-7!">
        <PlayIcon />
        {t.game.go}
      </Button>
    </>
  );
}
