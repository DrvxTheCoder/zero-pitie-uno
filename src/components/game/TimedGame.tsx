"use client";

import { useCallback, useState } from "react";
import { useGameTimer } from "@/hooks/useGameTimer";
import { cues } from "@/lib/sound";
import { RAY_SPIN_S, SLAB_WOBBLE_S, SPIN_RESULT_S, SPIN_TIMES_UP_S } from "@/lib/timer-phases";
import type { PlayerDTO } from "@/lib/types";
import { GameTopBar } from "./GameTopBar";
import { OverlayFrame } from "./OverlayFrame";
import { ResultSheet } from "./ResultSheet";
import { TimerStage } from "./TimerStage";
import { TimesUpBurst } from "./TimesUpBurst";

type Stage = "countdown" | "timesUp" | "result";

/** Timer → "time's up" burst → result sheet. */
export function TimedGame({
  leagueName,
  players,
  onClose,
  onSaved,
}: {
  leagueName: string;
  players: PlayerDTO[];
  onClose: () => void;
  onSaved: (winner: string, loser: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("countdown");
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const timer = useGameTimer({
    onTimesUp: (seconds) => {
      setPlayedSeconds(seconds);
      setStage("timesUp");
      cues.timesUp();
    },
  });

  const showResult = useCallback(() => setStage("result"), []);

  const topBar = <GameTopBar leagueName={leagueName} onQuit={onClose} />;

  if (stage === "countdown") {
    const { phase, secondsLeft } = timer;
    return (
      <OverlayFrame
        phase={phase}
        paused={timer.paused}
        flash={phase === 4 && secondsLeft % 2 === 0}
        shake={phase === 4}
        spinSeconds={RAY_SPIN_S[phase]}
        wobbleSeconds={SLAB_WOBBLE_S[phase]}
        topBar={topBar}
      >
        <TimerStage
          secondsLeft={secondsLeft}
          phase={phase}
          paused={timer.paused}
          onTogglePause={timer.togglePause}
          onFinish={timer.finish}
        />
      </OverlayFrame>
    );
  }

  if (stage === "timesUp") {
    return (
      <OverlayFrame
        phase={4}
        spinSeconds={SPIN_TIMES_UP_S}
        topBar={topBar}
        layers={<TimesUpBurst onDone={showResult} />}
      />
    );
  }

  return (
    <OverlayFrame phase={0} spinSeconds={SPIN_RESULT_S} topBar={topBar}>
      <ResultSheet players={players} durationS={playedSeconds} onCancel={onClose} onSaved={onSaved} />
    </OverlayFrame>
  );
}
