"use client";

import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" className="inline-flex overflow-hidden rounded-[12px] border-3 border-ink bg-paper shadow-ink-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "border-0 px-3 py-[7px] font-display text-[12px] uppercase",
            value === o.value ? "bg-ink text-yellow" : "bg-transparent",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
