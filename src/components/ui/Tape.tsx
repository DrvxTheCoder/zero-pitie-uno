import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Slanted label strip used as section titles ("CLASSEMENT", "AUJOURD'HUI"…). */
export function Tape({
  className,
  tone = "ink",
  size = "md",
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: "ink" | "yellow"; size?: "md" | "sm" }) {
  return (
    <span
      className={cn(
        "inline-block -rotate-[1.5deg] px-3 pt-1 pb-[3px] font-display leading-[1.2] tracking-[.03em] uppercase w-fit",
        size === "md" ? "text-[15px]" : "text-[13px]",
        tone === "ink" ? "bg-ink text-paper" : "border-3 border-ink bg-yellow text-ink",
        className,
      )}
      {...rest}
    />
  );
}
