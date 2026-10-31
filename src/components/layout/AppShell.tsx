import type { ReactNode } from "react";

/** Centered content column above the background, leaving room for the phone bottom nav. */
export function AppShell({ children }: { children: ReactNode }) {
  return <div className="relative z-1 mx-auto max-w-[1120px] pt-8 pb-[128px] desk:pt-5 desk:pb-14">{children}</div>;
}

/** Two-column board layout on desktop (content + 340px aside), single column on phones. */
export function MainGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-[22px] desk:grid-cols-[minmax(0,1fr)_340px] desk:items-start">{children}</div>;
}

export function Stack({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid min-w-0 gap-[18px] ${className}`}>{children}</div>;
}
