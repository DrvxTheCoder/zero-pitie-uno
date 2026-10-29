import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLElement> & {
  /** Lay children out as a vertical grid. Pass a gap class to change the default 12px gap. */
  stack?: boolean | "gap-1.5" | "gap-2.5" | "gap-3" | "gap-3.5";
};

/** Paper slab with thick outline and hard shadow. */
export function Panel({ className, stack, ...rest }: Props) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-[18px] border-3 border-ink bg-paper p-4 shadow-ink-6",
        stack && "grid",
        stack && (stack === true ? "gap-3" : stack),
        className,
      )}
      {...rest}
    />
  );
}
