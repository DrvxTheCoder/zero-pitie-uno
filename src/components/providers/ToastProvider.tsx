"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Toast } from "@/components/ui/Toast";

type ToastFn = (message: string, tone?: "ok" | "bad") => void;

const ToastContext = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: "ok" | "bad" } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback<ToastFn>((message, tone = "ok") => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <Toast key={toast.id} message={toast.message} tone={toast.tone} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
