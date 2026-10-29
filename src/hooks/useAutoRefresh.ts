"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { REFRESH_MS } from "@/lib/constants";

/** Re-fetch server data periodically while the page is visible and `enabled`. */
export function useAutoRefresh(enabled: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, router]);
}
