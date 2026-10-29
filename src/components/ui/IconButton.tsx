import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { size?: "md" | "lg" };

/** Square paper button holding an icon (or a 2-letter label like "EN"). */
export function IconButton({ size = "md", className, type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        "grid place-items-center rounded-[12px] border-3 border-ink bg-paper p-0 font-display text-[12px] shadow-ink-3",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none [&_svg]:size-5",
        size === "md" ? "size-10" : "size-[46px]",
        className,
      )}
      {...rest}
    />
  );
}
