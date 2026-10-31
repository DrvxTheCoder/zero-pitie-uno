"use client";

import { useId } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Avatar } from "@/components/ui/Badges";
import { playerColor, type Standing } from "@/lib/stats";
import type { PlayerDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Laid out 2 – 1 – 3. Bars rise 3rd → 2nd → 1st, then the medals drop in.
 * `h` sets --h, the bar height, shared by the bar and by its label column above.
 */
const PLACES = [
  { rank: 2, h: "[--h:clamp(104px,28vw,160px)]", bar: "bg-blue", delay: 120 },
  { rank: 1, h: "[--h:clamp(136px,37vw,200px)]", bar: "bg-yellow", delay: 240 },
  { rank: 3, h: "[--h:clamp(84px,22vw,134px)]", bar: "bg-green", delay: 0 },
] as const;

/** Same columns in both layers so labels sit exactly over their bar. */
const COLUMNS = "grid grid-cols-3 gap-[clamp(6px,2vw,12px)]";

/** Disc and ring colours, as utilities so Tailwind emits the tokens. */
const METALS = {
  1: { disc: "fill-yellow", ring: "stroke-gold-dk", star: "fill-gold-dk" },
  2: { disc: "fill-silver", ring: "stroke-silver-dk", star: "fill-silver-dk" },
  3: { disc: "fill-bronze", ring: "stroke-bronze-dk", star: "fill-bronze-dk" },
} as const;

/** Flat ribbon medal with ink outlines; a glint sweeps across the disc. */
function Medal({ rank }: { rank: 1 | 2 | 3 }) {
  const clip = useId();
  const m = METALS[rank];
  return (
    <svg viewBox="0 0 60 82" className="block w-full overflow-visible" aria-hidden>
      <g className="stroke-ink" strokeWidth="3" strokeLinejoin="round">
        <path d="M12 2h15l9 38H23z" className="fill-blue" />
        <path d="M48 2H33l-9 38h13z" className="fill-green" />
        <circle cx="30" cy="56" r="23" className={m.disc} />
      </g>
      <clipPath id={clip}>
        <circle cx="30" cy="56" r="21.5" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path d="M22 26h7L19 86h-7z" className="animate-shine fill-paper opacity-70 motion-reduce:hidden" />
      </g>
      <circle cx="30" cy="56" r="15" fill="none" strokeWidth="2.5" className={m.ring} />
      <path
        d="M30 46.5l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"
        className={cn(m.star, "stroke-ink")}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Top 3 of the season on a flat podium: 2nd left, 1st in the middle, 3rd right.
 *
 * Two stacked layers. Behind: the bars and the base as one element (the base is the row's
 * bottom border, so bars sit flush on it), with a single drop shadow following the whole
 * silhouette. In front: avatars, names and medals, each column padded by its bar's height.
 */
export function Podium({ top, players }: { top: Standing[]; players: PlayerDTO[] }) {
  const { t } = useI18n();
  return (
    <div className="relative mx-auto w-full max-w-125 pt-2 pr-1.5 pb-1.5">
      <div
        className={cn(
          COLUMNS,
          "absolute inset-x-0 bottom-1.5 mr-1.5 items-end rounded-b-sm border-b-12 border-ink",
          "[filter:drop-shadow(6px_6px_0_var(--color-red-dk))]",
        )}
      >
        {PLACES.map(({ rank, h, bar, delay }) => {
          const s = top[rank - 1];
          return (
            <div
              key={rank}
              className={cn(
                h,
                "relative flex h-(--h) animate-grow-up items-end justify-center overflow-hidden rounded-t-[14px] border-3 border-b-0 border-ink motion-reduce:animate-none",
                s ? bar : "bg-paper",
              )}
              style={{ animationDelay: `${delay}ms` }}
            >
              {s && <div className="absolute inset-0 grain bg-size-[200px] opacity-50" />}
              {/* <span
                className={cn(
                  "relative flex items-start pb-[clamp(4px,1.5vw,10px)] font-display leading-[.8] tracking-[-.04em]",
                  s ? "text-paper text-stroke-3 text-shadow-ink-6" : "text-line [-webkit-text-stroke:2px_var(--color-muted)] [paint-order:stroke_fill]",
                )}
              >
                <span className="text-[clamp(52px,15vw,84px)]">{s ? rank : "?"}</span>
                {s && (
                  <span className="mt-[.2em] ml-0.5 text-[clamp(16px,4.4vw,24px)] tracking-normal text-shadow-ink-3">
                    {t.board.ordinal(rank)}
                  </span>
                )}
              </span> */}
            </div>
          );
        })}
      </div>

      <div className={cn(COLUMNS, "relative z-1 items-end")}>
        {PLACES.map(({ rank, h, delay }) => {
          const s = top[rank - 1];
          return (
            <div
              key={rank}
              className={cn(
                h,
                "grid min-w-0 animate-ride-up justify-items-center gap-0.5 pb-[calc(var(--h)+12px)] motion-reduce:animate-none",
              )}
              style={{ animationDelay: `${delay}ms` }}
            >
              {s && <Avatar name={s.player.name} color={playerColor(players, s.player.id)} />}
              <b className="max-w-full -rotate-2 truncate rounded-md bg-ink px-2.5 pt-0.75 pb-0.5 font-display text-[clamp(13px,3.4vw,17px)] text-paper">
                {s ? s.player.name : "—"}
              </b>
              {/* 4px gap down to the bar; its bottom edge is the bar's top, where the medal hangs */}
              <div className="relative h-1 w-full">
                {s && (
                  <div className="absolute top-full left-1/2 w-[clamp(40px,11vw,54px)] -translate-x-1/2">
                    <div
                      className="animate-pop-in motion-reduce:animate-none"
                      style={{ animationDelay: `${700 + (3 - rank) * 150}ms` }}
                    >
                      <div
                        className="origin-top animate-swing motion-reduce:animate-none"
                        style={{ animationDelay: `${-rank * 0.7}s` }}
                      >
                        <Medal rank={rank} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
