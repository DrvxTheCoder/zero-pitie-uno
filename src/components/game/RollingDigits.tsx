"use client";

import { useEffect, useRef } from "react";
import type { Phase } from "@/lib/timer-phases";
import { clock, cn } from "@/lib/utils";

/** One odometer column: a 0–9 strip slid vertically to the current digit. */
function DigitColumn({ digit }: { digit: number }) {
  return (
    <span className="h-[1em] w-[.8em] overflow-hidden text-center">
      <span
        className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.3,1.5,.5,1)]"
        style={{ transform: `translateY(${-digit}em)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

/** The big m:ss slab. Wobbles, thumps every second from phase 2, recolours by phase. */
export function RollingDigits({ secondsLeft, phase, paused }: { secondsLeft: number; phase: Phase; paused: boolean }) {
  const digitsRef = useRef<HTMLDivElement>(null);
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  // Restart the thump animation on every second once it's getting hot
  useEffect(() => {
    const el = digitsRef.current;
    if (!el || phase < 2) return;
    el.classList.remove("animate-thump");
    void el.offsetWidth;
    el.classList.add("animate-thump");
  }, [secondsLeft, phase]);

  return (
    <div
      className={cn(
        "animate-wobble rounded-[clamp(18px,4vw,30px)] px-[clamp(16px,4vw,32px)] pt-[clamp(8px,2vw,14px)] pb-[clamp(4px,1vw,8px)] [transform:rotate(-3deg)]",
        phase === 3 && "border-4 border-ink bg-red shadow-ink-10",
        phase === 4 && "bg-ink shadow-yellow-10",
        phase < 3 && "bg-ink shadow-deep-10",
        paused && "[animation-play-state:paused]",
      )}
    >
      <div
        ref={digitsRef}
        role="timer"
        aria-label={clock(secondsLeft)}
        className={cn(
          "flex items-center font-display text-[clamp(84px,27vw,230px)] leading-none transition-colors duration-[400ms]",
          phase === 2 || phase === 3 ? "text-paper" : "text-yellow",
        )}
      >
        <DigitColumn digit={m % 10} />
        <span className={cn("w-[.32em] [transform:translateY(-.06em)] text-center", !paused && "animate-blink")}>:</span>
        <DigitColumn digit={Math.floor(s / 10)} />
        <DigitColumn digit={s % 10} />
      </div>
    </div>
  );
}
