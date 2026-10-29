"use client";

import { useCallback, useEffect, useState } from "react";
import { GAME_MINUTES_DEFAULT, GAME_MINUTES_MAX, GAME_MINUTES_MIN } from "@/lib/constants";

const DURATION_KEY = "zp_duration";

const clamp = (m: number) => Math.min(GAME_MINUTES_MAX, Math.max(GAME_MINUTES_MIN, Math.round(m)));

/** Last chosen game length in minutes (localStorage `zp_duration`, default 5). */
export function useGameDuration() {
  const [minutes, setMinutes] = useState(GAME_MINUTES_DEFAULT);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(DURATION_KEY));
      if (saved) setMinutes(clamp(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const choose = useCallback((m: number) => {
    const next = clamp(m);
    setMinutes(next);
    try {
      localStorage.setItem(DURATION_KEY, String(next));
    } catch {
      /* ignore */
    }
  }, []);

  return [minutes, choose] as const;
}
