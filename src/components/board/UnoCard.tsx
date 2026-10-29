import { cn } from "@/lib/utils";

/**
 * UNO-style card: black frame, coloured face, tilted white oval with the big
 * outlined value, rank in the corners. `color` is a CSS colour.
 */
export function UnoCard({
  value,
  color,
  corner,
  empty,
  className,
}: {
  value: string;
  color: string;
  corner?: string;
  empty?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[5/7] w-full rounded-[clamp(10px,2vw,16px)] bg-ink p-[6%] shadow-deep-6", className)}>
      <div
        className="relative grid h-full place-items-center overflow-hidden rounded-[clamp(6px,1.4vw,11px)]"
        style={{ background: empty ? "var(--color-paper)" : color }}
      >
        {corner && <Corner>{corner}</Corner>}
        <div className="absolute h-[64%] w-[88%] -rotate-[28deg] rounded-[50%] border-3 border-ink bg-paper" />
        <div className="absolute inset-0 grain bg-size-[200px] opacity-50" />
        <div
          className={cn(
            "relative z-1 -rotate-8 font-display text-[clamp(24px,7vw,52px)] leading-none",
            empty ? "text-line [-webkit-text-stroke:2px_var(--color-muted)] [paint-order:stroke_fill]" : "text-stroke-[2.5px] text-shadow-ink-3",
          )}
          style={empty ? undefined : { color }}
        >
          {value}
        </div>
        {corner && <Corner flipped>{corner}</Corner>}
      </div>
    </div>
  );
}

function Corner({ children, flipped }: { children: string; flipped?: boolean }) {
  return (
    <span
      className={cn(
        "absolute z-1 font-display text-[clamp(11px,2.6vw,18px)] text-paper text-stroke-[1.5px] text-shadow-ink-2",
        flipped ? "right-[8%] bottom-[5%] rotate-180" : "top-[5%] left-[8%]",
      )}
    >
      {children}
    </span>
  );
}
