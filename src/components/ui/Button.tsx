import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "paper" | "yellow" | "ink" | "green" | "red";
export type ButtonSize = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 border-3 border-ink font-display uppercase tracking-[.02em] no-underline " +
  "transition-[translate,box-shadow] duration-[80ms] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none " +
  "disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<ButtonSize, string> = {
  md: "rounded-[14px] px-[18px] py-3 text-[15px] shadow-ink-4 [&_svg]:size-5",
  sm: "rounded-[10px] px-[11px] py-[7px] text-[12px] shadow-ink-3 [&_svg]:size-4",
};

const variants: Record<ButtonVariant, string> = {
  paper: "bg-paper",
  yellow: "bg-yellow",
  ink: "bg-ink text-paper shadow-yellow-4",
  green: "bg-green text-paper",
  red: "bg-red text-paper",
};

/** Class string for anything that should look like a button (also used on <Link>). */
export function buttonClasses(variant: ButtonVariant = "paper", size: ButtonSize = "md", armed = false) {
  return cn(base, sizes[size], armed ? "bg-ink text-yellow" : variants[variant]);
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Two-tap confirmation state (see ConfirmButton). */
  armed?: boolean;
};

export function Button({ variant = "paper", size = "md", armed, className, type = "button", ...rest }: Props) {
  return <button type={type} className={cn(buttonClasses(variant, size, armed), className)} {...rest} />;
}
