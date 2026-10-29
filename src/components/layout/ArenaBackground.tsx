import { cn } from "@/lib/utils";

/** Path of the alternating dark wedges of the red "burst" (28 slices, every other one drawn). */
function raysPath(slices = 28) {
  let d = "";
  for (let i = 0; i < slices; i += 2) {
    const a1 = (i / slices) * Math.PI * 2;
    const a2 = ((i + 1) / slices) * Math.PI * 2;
    const p = (a: number) => `${(Math.cos(a) * 150).toFixed(1)} ${(Math.sin(a) * 150).toFixed(1)}`;
    d += `M0 0L${p(a1)}L${p(a2)}Z`;
  }
  return d;
}
const RAYS = raysPath();

/**
 * Rotating ray burst + speckle texture behind everything.
 * Spin speed comes from the `--spin` CSS variable of an ancestor (the game overlay speeds it up).
 */
export function ArenaBackground({ center = "40%", className }: { center?: "40%" | "50%"; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}>
      <svg
        viewBox="-100 -100 200 200"
        className={cn(
          "absolute left-1/2 size-[260vmax] animate-rays fill-red-dk [transform:translate(-50%,-50%)]",
          center === "40%" ? "top-[40%]" : "top-1/2",
          "group-data-[paused=true]/ov:[animation-play-state:paused]",
        )}
      >
        <path d={RAYS} />
      </svg>
      <div className="absolute inset-0 grain bg-size-[260px_260px] opacity-75" />
    </div>
  );
}
