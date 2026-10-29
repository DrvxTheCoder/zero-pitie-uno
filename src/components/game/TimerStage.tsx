"use client";

import { FlagIcon, PauseIcon, PlayIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import type { Phase } from "@/lib/timer-phases";
import { PhaseLabel } from "./PhaseLabel";
import { RollingDigits } from "./RollingDigits";
import { TimeBlocks } from "./TimeBlocks";

export function TimerStage({
  secondsLeft,
  phase,
  paused,
  onTogglePause,
  onFinish,
}: {
  secondsLeft: number;
  phase: Phase;
  paused: boolean;
  onTogglePause: () => void;
  onFinish: () => void;
}) {
  const { t } = useI18n();
  return (
    <>
      <PhaseLabel phase={phase} />
      <RollingDigits secondsLeft={secondsLeft} phase={phase} paused={paused} />
      <TimeBlocks secondsLeft={secondsLeft} />
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="ink" onClick={onTogglePause}>
          {paused ? <PlayIcon /> : <PauseIcon />}
          {paused ? t.game.resume : t.game.pause}
        </Button>
        <ConfirmButton variant="yellow" onConfirm={onFinish}>
          <FlagIcon />
          {t.game.finish}
        </ConfirmButton>
      </div>
    </>
  );
}
