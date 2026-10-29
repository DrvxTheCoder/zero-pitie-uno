import type { ReactNode } from "react";
import { Panel } from "./Panel";

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Panel className="grid justify-items-center gap-3 px-3 py-[26px] text-center">
      <b className="font-display text-[22px] leading-[1.05] uppercase">{title}</b>
      {subtitle && <span className="text-muted">{subtitle}</span>}
      {action}
    </Panel>
  );
}
