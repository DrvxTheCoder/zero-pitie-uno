import { cn } from "@/lib/utils";

/** 30 blocks, each a 30th of the game; spent blocks drop to dark red. */
export function TimeBlocks({ secondsLeft, totalSeconds }: { secondsLeft: number; totalSeconds: number }) {
  const lit = Math.ceil((secondsLeft * 30) / totalSeconds);
  return (
    <div aria-hidden className="grid w-[min(560px,100%)] grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px]">
      {Array.from({ length: 30 }, (_, i) => (
        <i
          key={i}
          className={cn(
            "h-4 rounded-[3px] border-2 border-ink transition-[background-color,scale] duration-300",
            i >= lit ? "scale-y-50 bg-red-dk" : "bg-yellow",
          )}
        />
      ))}
    </div>
  );
}
