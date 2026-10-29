import { cn, signed } from "@/lib/utils";

/** Green / red / neutral score badge: "+7", "−2", "0". */
export function DiffBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "min-w-[54px] rounded-[10px] border-3 border-ink px-2 pt-1 pb-[3px] text-center font-display text-base tabular-nums",
        value > 0 && "bg-green text-paper text-shadow-ink-2",
        value < 0 && "bg-red text-paper text-shadow-ink-2",
        value === 0 && "bg-paper text-ink",
        className,
      )}
    >
      {signed(value)}
    </span>
  );
}

/** Coloured initial tile for a player. */
export function Avatar({ name, color, className }: { name: string; color: string; className?: string }) {
  return (
    <span
      style={{ background: color }}
      className={cn(
        "grid size-[38px] -rotate-4 place-items-center rounded-[10px] border-3 border-ink font-display text-base text-paper text-shadow-ink-2",
        className,
      )}
    >
      {name[0]?.toUpperCase()}
    </span>
  );
}

/** "V×3" hot streak or "D×4" cold streak, shown from 3 in a row. */
export function StreakBadge({ streak, winLetter, lossLetter }: { streak: number; winLetter: string; lossLetter: string }) {
  if (Math.abs(streak) < 3) return null;
  return (
    <span
      className={cn(
        "ml-1 inline-block rounded-[5px] px-[5px] py-px align-[2px] text-[10px] font-extrabold",
        streak > 0 ? "bg-ink text-yellow" : "bg-blue text-paper",
      )}
    >
      {streak > 0 ? winLetter : lossLetter}×{Math.abs(streak)}
    </span>
  );
}

/** Small number tile ("12 PARTIES"). */
export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="min-w-0 rounded-[12px] border-3 border-ink bg-paper p-2 text-center">
      <b className="block font-display text-[24px] leading-[1.1] tabular-nums">{value}</b>
      <span className="text-[11px] font-extrabold tracking-[.05em] text-muted uppercase">{label}</span>
    </div>
  );
}
