"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GAME_MS } from "@/lib/constants";
import { cues } from "@/lib/sound";
import { phaseOf, type Phase } from "@/lib/timer-phases";

type Options = {
  /** Called once when the countdown reaches zero (or "Finish" is used), with seconds actually played. */
  onTimesUp: (playedSeconds: number) => void;
};

/**
 * 5-minute countdown driven by requestAnimationFrame against a fixed end time,
 * so it stays accurate when the tab is throttled. Also handles per-second sound
 * cues, pause (button or space bar) and keeping the screen awake.
 */
export function useGameTimer({ onTimesUp }: Options) {
  const [secondsLeft, setSecondsLeft] = useState(GAME_MS / 1000);
  const [paused, setPaused] = useState(false);

  const state = useRef({ endAt: 0, remaining: GAME_MS, running: true, done: false, raf: 0 });
  const onTimesUpRef = useRef(onTimesUp);
  onTimesUpRef.current = onTimesUp;

  const finish = useCallback(() => {
    const s = state.current;
    if (s.done) return;
    if (s.running) s.remaining = Math.max(0, s.endAt - performance.now());
    s.done = true;
    cancelAnimationFrame(s.raf);
    onTimesUpRef.current(Math.round((GAME_MS - s.remaining) / 1000));
  }, []);

  // Main loop
  useEffect(() => {
    const s = state.current;
    s.endAt = performance.now() + s.remaining;
    const loop = () => {
      if (s.done) return;
      if (s.running) s.remaining = Math.max(0, s.endAt - performance.now());
      const next = Math.ceil(s.remaining / 1000);
      setSecondsLeft((prev) => (prev === next ? prev : next));
      if (s.remaining <= 0) return finish();
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.raf);
  }, [finish]);

  const togglePause = useCallback(() => {
    const s = state.current;
    if (s.done) return;
    if (s.running) {
      s.running = false;
      s.remaining = Math.max(0, s.endAt - performance.now());
    } else {
      s.running = true;
      s.endAt = performance.now() + s.remaining;
    }
    setPaused(!s.running);
  }, []);

  // Sound cues, once per second
  const phase = phaseOf(secondsLeft);
  const lastPhase = useRef<Phase | -1>(-1);
  useEffect(() => {
    if (secondsLeft <= 0 || state.current.done) return;
    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      if (phase > 0) cues.phaseUp(phase);
    }
    if (phase === 4) cues.tickFinal(secondsLeft);
    else if (phase === 3) cues.tickHot();
    else if (phase === 2 && secondsLeft % 2 === 0) cues.tickWarm();
  }, [secondsLeft, phase]);

  // Space bar toggles pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.code === "Space" && !target.closest("button,input,select")) {
        e.preventDefault();
        togglePause();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [togglePause]);

  // Keep the screen awake while the countdown runs
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const acquire = async () => {
      try {
        lock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        lock = null;
      }
    };
    const onVisible = () => {
      if (!document.hidden && !state.current.done) void acquire();
    };
    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release().catch(() => {});
    };
  }, []);

  return { secondsLeft, phase, paused, togglePause, finish };
}
