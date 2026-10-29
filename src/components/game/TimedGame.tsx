"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useGameTimer } from "@/hooks/useGameTimer";
import { cues, unlockAudio } from "@/lib/sound";
import { RAY_SPIN_S, SLAB_WOBBLE_S, SPIN_QUICK_ENTRY_S, SPIN_RESULT_S, SPIN_TIMES_UP_S } from "@/lib/timer-phases";
import type { PlayerDTO } from "@/lib/types";
import { DurationPicker } from "./DurationPicker";
import { GameTopBar } from "./GameTopBar";
import { OverlayFrame } from "./OverlayFrame";
import { ResultSheet } from "./ResultSheet";
import { TimerStage } from "./TimerStage";
import { TimesUpBurst } from "./TimesUpBurst";

type Stage = "ready" | "countdown" | "timesUp" | "result";

/** Duration picker → timer → "time's up" burst → result sheet. */
export function TimedGame({
  leagueName,
  players,
  minutes,
  onMinutesChange,
  onClose,
  onSaved,
}: {
  leagueName: string;
  players: PlayerDTO[];
  /** Remembered game length, edited on the "ready" stage. */
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  onClose: () => void;
  onSaved: (winner: string, loser: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("ready");
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const go = useCallback(() => {
    // First thing in the tap: iOS only unlocks audio synchronously inside the gesture.
    unlockAudio({ playback: true });
    cues.start();
    setStage("countdown");
  }, []);

  const timesUp = useCallback((seconds: number) => {
    setPlayedSeconds(seconds);
    setStage("timesUp");
    cues.timesUp();
  }, []);

  const showResult = useCallback(() => setStage("result"), []);

  const topBar = <GameTopBar leagueName={leagueName} onQuit={onClose} />;

  if (stage === "ready") {
    return (
      <OverlayFrame phase={0} spinSeconds={SPIN_QUICK_ENTRY_S} topBar={topBar}>
        <DurationPicker minutes={minutes} onChange={onMinutesChange} onGo={go} />
      </OverlayFrame>
    );
  }

  if (stage === "countdown") {
    return <Countdown totalSeconds={minutes * 60} topBar={topBar} onTimesUp={timesUp} />;
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

/** The running countdown; mounted on "C'est parti" so the clock starts then. */
function Countdown({
  totalSeconds,
  topBar,
  onTimesUp,
}: {
  totalSeconds: number;
  topBar: ReactNode;
  onTimesUp: (playedSeconds: number) => void;
}) {
  const timer = useGameTimer({ totalSeconds, onTimesUp });
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
        totalSeconds={totalSeconds}
        phase={phase}
        paused={timer.paused}
        onTogglePause={timer.togglePause}
        onFinish={timer.finish}
      />
    </OverlayFrame>
  );
}
