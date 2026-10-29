"use client";

import { useEffect } from "react";

/** Registers /sw.js in production builds (it would cache stale chunks during `next dev`). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* offline support is optional */
    });
  }, []);
  return null;
}
