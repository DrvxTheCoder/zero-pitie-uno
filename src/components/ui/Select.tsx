"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { fieldBase } from "./Form";

export type SelectOption = { value: string; label: string };

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 right-3 size-[22px] -translate-y-1/2 text-ink transition-transform duration-150",
        open && "rotate-180",
      )}
    >
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-[18px] shrink-0">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const GAP = 6;
const MARGIN = 12;
const TYPEAHEAD_MS = 600;

/**
 * Select-only combobox (WAI-ARIA APG pattern) with the brutalist frame.
 * The list is portalled to <body> so scrolling sheets and overlays don't clip it.
 */
export function Select({
  id,
  options,
  value,
  onChange,
  placeholder,
  compact,
  className,
  "aria-labelledby": labelledBy,
}: {
  id: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Shown while `value` matches no option. */
  placeholder?: string;
  compact?: boolean;
  className?: string;
  "aria-labelledby"?: string;
}) {
  const listId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pos, setPos] = useState<CSSProperties | null>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];
  const optionId = (i: number) => `${listId}-${i}`;

  function show(index = Math.max(selectedIndex, 0)) {
    setActive(index);
    setOpen(true);
  }

  function hide() {
    setOpen(false);
    setPos(null);
  }

  function pick(i: number) {
    if (options[i]) onChange(options[i].value);
    hide();
  }

  /** Native-like type-to-select: repeated keystrokes refine, a pause restarts. */
  function match(key: string, from: number) {
    const now = Date.now();
    const t = typed.current;
    t.text = now - t.at > TYPEAHEAD_MS ? key : t.text + key;
    t.at = now;
    const query = t.text.toLowerCase();
    const start = t.text.length === 1 ? from + 1 : Math.max(from, 0);
    for (let k = 0; k < options.length; k++) {
      const i = (start + k) % options.length;
      if (options[i].label.toLowerCase().startsWith(query)) return i;
    }
    return -1;
  }

  function onKeyDown(e: KeyboardEvent) {
    const last = options.length - 1;
    const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        show(e.key === "Home" ? 0 : last);
      } else if (printable) {
        const i = match(e.key, selectedIndex);
        if (i >= 0) onChange(options[i].value);
      }
      return;
    }

    const move = (i: number) => {
      e.preventDefault();
      setActive(Math.min(Math.max(i, 0), last));
    };
    switch (e.key) {
      case "ArrowDown":
        return move(active + 1);
      case "ArrowUp":
        if (e.altKey) {
          e.preventDefault();
          return pick(active);
        }
        return move(active - 1);
      case "Home":
        return move(0);
      case "End":
        return move(last);
      case "PageDown":
        return move(active + 10);
      case "PageUp":
        return move(active - 10);
      case "Enter":
      case " ":
        e.preventDefault();
        return pick(active);
      case "Escape":
        e.preventDefault();
        return hide();
      case "Tab":
        return pick(active);
      default:
        if (printable) {
          const i = match(e.key, active);
          if (i >= 0) setActive(i);
        }
    }
  }

  // Anchor the list under the trigger (or above it when there's more room there).
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const r = triggerRef.current!.getBoundingClientRect();
      const below = window.innerHeight - r.bottom - GAP - MARGIN;
      const above = r.top - GAP - MARGIN;
      const up = below < 180 && above > below;
      setPos({
        left: Math.min(r.left, window.innerWidth - r.width - MARGIN),
        minWidth: r.width,
        maxWidth: `calc(100vw - ${MARGIN * 2}px)`,
        maxHeight: Math.min(320, up ? above : below),
        ...(up ? { bottom: window.innerHeight - r.top + GAP } : { top: r.bottom + GAP }),
        ...(compact ? {} : { width: r.width }),
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, compact]);

  // Close on any press outside the trigger and the list.
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) hide();
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open && pos) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, pos, active]);

  return (
    <div className={cn("relative", compact ? "w-auto" : "w-full")}>
      <div
        ref={triggerRef}
        id={id}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}` : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        onClick={() => (open ? hide() : show())}
        onKeyDown={onKeyDown}
        className={cn(
          fieldBase,
          "cursor-pointer truncate font-extrabold select-none",
          open && "shadow-[0_0_0_3px_var(--color-yellow)]",
          compact ? "w-auto py-2 pr-10 pl-3 text-[15px]" : "w-full py-3 pr-11 pl-[14px] text-[18px]",
          className,
        )}
      >
        {selected ? selected.label : <span className="text-muted">{placeholder}</span>}
      </div>
      <Chevron open={open} />

      {open &&
        pos &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelledBy}
            style={pos}
            className="fixed z-70 m-0 animate-drop list-none overflow-y-auto overscroll-contain rounded-[14px] border-3 border-ink bg-paper p-1.5 shadow-ink-5"
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={optionId(i)}
                role="option"
                aria-selected={i === selectedIndex}
                // Keep focus on the combobox so keyboard handling stays in one place.
                onMouseDown={(e) => e.preventDefault()}
                onPointerMove={() => active !== i && setActive(i)}
                onClick={() => pick(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-[9px] border-2 px-3 py-2.5 font-extrabold",
                  compact ? "text-[15px]" : "text-[17px]",
                  i === selectedIndex ? "bg-ink text-yellow" : i === active ? "bg-yellow" : "",
                  i === active ? "border-ink" : "border-transparent",
                )}
              >
                <span className="truncate">{o.label}</span>
                {i === selectedIndex && <Check />}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
