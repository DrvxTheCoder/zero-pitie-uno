"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { cn } from "@/lib/utils";

const CARD_LABELS = ["+2", "+4", "+6", "+10", "⊘", "⇄", "+4", "+2", "+10", "⊘", "+6", "⇄", "+4", "+2"];
const CARD_COLORS = ["var(--color-yellow)", "var(--color-blue)", "var(--color-green)", "var(--color-red)", "var(--color-ink)"];

const HOLD_MS = 2300;
const EXIT_MS = 340;

type FlyingCard = { label: string; color: string; tx: string; ty: string; rotate: string };

function scatter(): FlyingCard[] {
  return CARD_LABELS.map((label, i) => {
    const angle = (i / CARD_LABELS.length) * Math.PI * 2 + Math.random() * 0.3;
    const radius = 34 + Math.random() * 16;
    return {
      label,
      color: CARD_COLORS[i % CARD_COLORS.length],
      tx: `${(Math.cos(angle) * radius).toFixed(1)}vmin`,
      ty: `${(Math.sin(angle) * radius).toFixed(1)}vmin`,
      rotate: `${Math.round(Math.random() * 540 - 270)}deg`,
    };
  });
}

/** White flash, "TEMPS ÉCOULÉ !" slammed in, cards exploding outwards; then flies away. */
export function TimesUpBurst({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [cards] = useState(scatter);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setLeaving(true), HOLD_MS);
    const b = setTimeout(onDone, HOLD_MS + EXIT_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onDone]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-3 animate-boom bg-paper" />
      <div className={cn("pointer-events-none absolute inset-0 z-4 grid place-items-center", leaving && "animate-exit-up")}>
        {cards.map((c, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 aspect-[5/7] w-[clamp(48px,11vw,72px)] animate-fly-out rounded-[9px] bg-ink p-1"
            style={{ "--tx": c.tx, "--ty": c.ty, "--r": c.rotate } as CSSProperties}
          >
            <div
              className="grid h-full place-items-center rounded-[6px] font-display text-[clamp(14px,3.5vw,22px)] text-paper text-stroke-[1.5px] text-shadow-ink-2"
              style={{ background: c.color }}
            >
              {c.label}
            </div>
          </div>
        ))}
        <div className="animate-slam text-center font-display text-[clamp(56px,16vw,150px)] leading-[.92] text-yellow uppercase text-stroke-4 text-shadow-ink-9">
          {t.game.timesUp[0]}
          <br />
          {t.game.timesUp[1]}
        </div>
      </div>
    </>
  );
}
