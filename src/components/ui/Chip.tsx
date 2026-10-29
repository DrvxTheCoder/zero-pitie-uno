import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Chip({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex max-w-[220px] items-center gap-1.5 rounded-full border-3 border-ink bg-paper px-3 py-[5px] text-[13px] font-extrabold shadow-ink-3",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

/** Small outlined tag (back-office meta). */
export function Tag({ className, tone = "paper", ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: "paper" | "yellow" }) {
  return (
    <span
      className={cn(
        "rounded-[8px] border-2 border-ink px-2 py-0.5 text-[12px] font-extrabold",
        tone === "yellow" ? "bg-yellow" : "bg-paper",
        className,
      )}
      {...rest}
    />
  );
}
