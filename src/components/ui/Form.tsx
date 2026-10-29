import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "rounded-[12px] border-3 border-ink bg-paper focus:shadow-[0_0_0_3px_var(--color-yellow)] focus:outline-none";

const densities = {
  md: "px-[14px] py-3 text-base",
  sm: "px-2.5 py-2 text-[15px]",
  xs: "px-2.5 py-[7px] text-[14px]",
};

export function Input({
  className,
  density = "md",
  ...rest
}: ComponentProps<"input"> & { density?: keyof typeof densities }) {
  return (
    <input
      className={cn(fieldBase, "w-full min-w-0 font-semibold", densities[density], className)}
      {...rest}
    />
  );
}

export function Field({ label, htmlFor, children }: { label: ReactNode; htmlFor: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-extrabold tracking-[.06em] uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ErrorBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("rounded-[10px] bg-ink px-3 py-2 text-[14px] font-extrabold text-yellow", className)}>
      {children}
    </div>
  );
}
