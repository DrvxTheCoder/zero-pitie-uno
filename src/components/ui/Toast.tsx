import { cn } from "@/lib/utils";

export function Toast({ message, tone }: { message: string; tone: "ok" | "bad" }) {
  return (
    <div
      role="status"
      className={cn(
        "fixed top-[calc(14px+env(safe-area-inset-top,0px))] left-1/2 z-90 max-w-[calc(100%-32px)] [transform:translateX(-50%)]",
        "animate-toast-in rounded-[12px] border-3 border-ink px-4 py-2.5 text-center font-extrabold",
        tone === "bad" ? "bg-paper text-red shadow-ink-4" : "bg-ink text-yellow shadow-yellow-4",
      )}
    >
      {message}
    </div>
  );
}
