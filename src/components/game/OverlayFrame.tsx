"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { ArenaBackground } from "@/components/layout/ArenaBackground";
import type { Phase } from "@/lib/timer-phases";

type Props = {
  /** Drives phase-specific styles of descendants via `group-data-[phase=N]/ov:` variants. */
  phase?: Phase;
  paused?: boolean;
  /** Darken the background (final-seconds flashing). */
  flash?: boolean;
  spinSeconds: number;
  wobbleSeconds?: number;
  topBar: ReactNode;
  /** Centered content (timer or result sheet). */
  children?: ReactNode;
  /** Full-screen layers above the content (time's-up burst). */
  layers?: ReactNode;
  /** Shake the content (final seconds). */
  shake?: boolean;
};

/** Full-screen game layer: red burst background, top bar, centered stage. Locks page scroll. */
export function OverlayFrame({ phase, paused, flash, spinSeconds, wobbleSeconds = 5, topBar, children, layers, shake }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="group/ov fixed inset-0 z-60 flex flex-col overflow-hidden bg-red"
      data-phase={phase}
      data-paused={paused ? "true" : undefined}
      data-flash={flash ? "true" : undefined}
      style={{ "--spin": `${spinSeconds}s`, "--wob": `${wobbleSeconds}s` } as CSSProperties}
    >
      <ArenaBackground center="50%" className="group-data-[flash=true]/ov:brightness-30" />
      <div className="relative z-3 flex items-center justify-between gap-2.5 pt-[calc(12px+env(safe-area-inset-top,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
        {topBar}
      </div>
      <div
        className={
          "relative z-2 flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(16px,4vh,30px)] " +
          "pt-3 pr-[max(16px,env(safe-area-inset-right,0px))] pb-[calc(20px+env(safe-area-inset-bottom,0px))] pl-[max(16px,env(safe-area-inset-left,0px))] " +
          (shake ? "animate-shake" : "")
        }
      >
        {children}
      </div>
      {layers}
    </div>
  );
}
