"use client";

import { useEffect } from "react";
import { cues, isAudioRunning, unlockAudio } from "@/lib/sound";

const PRESSABLE = "button, a[href], [role='button']";

function pressable(target: EventTarget | null) {
  const el = target instanceof Element ? target.closest<HTMLElement>(PRESSABLE) : null;
  if (!el || el.matches(":disabled") || el.getAttribute("aria-disabled") === "true") return null;
  return el;
}

/**
 * One delegated listener for the whole app: a short "thunk" on every button, button-styled
 * link and nav item press. It also unlocks audio on the first tap, so game cues work later.
 *
 * Touch `pointerdown` is not a user activation on iOS, so before audio is running the thunk
 * waits for the matching `pointerup`/`click`, which unlocks the context and then plays it.
 */
export function PressSound() {
  useEffect(() => {
    let pending = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !pressable(e.target)) return;
      if (isAudioRunning()) cues.thunk();
      else pending = true;
    };
    const onActivate = () => {
      unlockAudio();
      if (pending) {
        pending = false;
        cues.thunk();
      }
    };
    const onCancel = () => {
      pending = false;
    };

    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onActivate, true);
    document.addEventListener("click", onActivate, true);
    document.addEventListener("keydown", onActivate, true);
    document.addEventListener("pointercancel", onCancel, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onActivate, true);
      document.removeEventListener("click", onActivate, true);
      document.removeEventListener("keydown", onActivate, true);
      document.removeEventListener("pointercancel", onCancel, true);
    };
  }, []);

  return null;
}
