"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** Id of the element that scrolls the app (the document itself never scrolls). */
export const SCROLL_ROOT_ID = "app-scroll";

/**
 * The app's only scroll container. It starts below the iOS status bar, so content never
 * slides under it (where iOS blurs it); the fixed ray background still runs to the top edge.
 * Goes back to the top on every route change, which Next can't do with an inner scroller.
 */
export function ScrollRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      ref={ref}
      id={SCROLL_ROOT_ID}
      className={
        "fixed inset-x-0 top-[env(safe-area-inset-top,0px)] bottom-0 z-1 overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] " +
        "pr-[max(16px,env(safe-area-inset-right,0px))] pb-[env(safe-area-inset-bottom,0px)] pl-[max(16px,env(safe-area-inset-left,0px))]"
      }
    >
      {children}
    </div>
  );
}

/** Stop the app from scrolling while a full-screen layer is open. Returns the undo function. */
export function lockScrollRoot() {
  const el = document.getElementById(SCROLL_ROOT_ID);
  if (!el) return () => {};
  const prev = el.style.overflowY;
  el.style.overflowY = "hidden";
  return () => {
    el.style.overflowY = prev;
  };
}
