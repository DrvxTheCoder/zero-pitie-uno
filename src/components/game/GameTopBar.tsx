"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, MuteIcon, VolumeIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IconButton } from "@/components/ui/IconButton";
import { Tape } from "@/components/ui/Tape";
import { cues, isSoundOn, setSoundOn, unlockAudio } from "@/lib/sound";
import { cn } from "@/lib/utils";

/** Quit (two taps), league name, sound toggle. */
export function GameTopBar({ leagueName, onQuit }: { leagueName: string; onQuit: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const [armed, setArmed] = useState(false);
  const [sound, setSound] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setSound(isSoundOn());
    return () => clearTimeout(timer.current);
  }, []);

  function quit() {
    if (armed) return onQuit();
    setArmed(true);
    toast(t.common.sure);
    timer.current = setTimeout(() => setArmed(false), 2500);
  }

  function toggleSound() {
    const next = !sound;
    setSound(next);
    setSoundOn(next);
    if (next) {
      unlockAudio({ playback: true });
      cues.toggle();
    }
  }

  return (
    <>
      <IconButton size="lg" onClick={quit} aria-label={t.game.quit} className={cn(armed && "bg-ink! text-yellow!")}>
        <CloseIcon />
      </IconButton>
      <Tape tone="yellow" size="sm">
        {leagueName}
      </Tape>
      <IconButton size="lg" onClick={toggleSound} aria-label={t.game.sound}>
        {sound ? <VolumeIcon /> : <MuteIcon />}
      </IconButton>
    </>
  );
}
