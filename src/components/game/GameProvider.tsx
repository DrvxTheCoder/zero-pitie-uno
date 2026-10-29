"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { cues, releaseAudioSession, unlockAudio } from "@/lib/sound";
import type { PlayerDTO } from "@/lib/types";
import { QuickEntry } from "./QuickEntry";
import { TimedGame } from "./TimedGame";

type Mode = "timer" | "quick" | null;

type GameContextValue = {
  /** Open the 5-minute timer. */
  start: () => void;
  /** Open the result sheet without the timer. */
  quickEntry: () => void;
  /** Changes each time a game is saved (lets the board jump back to the season view). */
  savedAt: number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  leagueName,
  players,
  children,
}: {
  leagueName: string;
  /** Active players, sorted by name — the options of the winner/loser dropdowns. */
  players: PlayerDTO[];
  children: ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>(null);
  const [savedAt, setSavedAt] = useState(0);

  useAutoRefresh(mode === null);

  const open = useCallback(
    (next: Exclude<Mode, null>) => {
      if (players.length < 2) {
        toast(t.board.noPlayersSub, "bad");
        router.push("/players");
        return;
      }
      if (next === "timer") {
        // First thing in the tap: iOS only unlocks audio synchronously inside the gesture.
        unlockAudio({ playback: true });
        cues.start();
      }
      setMode(next);
    },
    [players.length, router, t, toast],
  );

  const close = useCallback(() => {
    setMode(null);
    releaseAudioSession();
  }, []);

  const handleSaved = useCallback(
    (winner: string, loser: string) => {
      setMode(null);
      setSavedAt(Date.now());
      toast(t.game.saved(winner, loser));
      cues.saved();
      // Let the chime finish before handing the iOS audio session back.
      setTimeout(releaseAudioSession, 400);
      router.push("/");
      router.refresh();
    },
    [router, t, toast],
  );

  const value = useMemo(
    () => ({ start: () => open("timer"), quickEntry: () => open("quick"), savedAt }),
    [open, savedAt],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
      {mode === "timer" && <TimedGame leagueName={leagueName} players={players} onClose={close} onSaved={handleSaved} />}
      {mode === "quick" && <QuickEntry players={players} onClose={close} onSaved={handleSaved} />}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
