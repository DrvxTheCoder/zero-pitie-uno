import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const linkClass = "border-0 bg-transparent p-0 font-extrabold underline underline-offset-[3px]";

/** Underlined bold link. `onRed` adds the white-on-red treatment used over the background. */
export function TextLink({ className, onRed, ...rest }: ComponentProps<typeof Link> & { onRed?: boolean }) {
  return <Link className={cn(linkClass, onRed && "text-paper text-shadow-ink-1", className)} {...rest} />;
}

export function TextButton({ className, onRed, type = "button", ...rest }: ComponentProps<"button"> & { onRed?: boolean }) {
  return <button type={type} className={cn(linkClass, onRed && "text-paper text-shadow-ink-1", className)} {...rest} />;
}
