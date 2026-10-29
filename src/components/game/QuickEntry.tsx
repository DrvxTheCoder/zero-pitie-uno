"use client";

import { CloseIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { IconButton } from "@/components/ui/IconButton";
import { SPIN_QUICK_ENTRY_S } from "@/lib/timer-phases";
import type { PlayerDTO } from "@/lib/types";
import { OverlayFrame } from "./OverlayFrame";
import { ResultSheet } from "./ResultSheet";

/** Result sheet without the timer ("Saisir un résultat sans chrono"). */
export function QuickEntry({
  players,
  onClose,
  onSaved,
}: {
  players: PlayerDTO[];
  onClose: () => void;
  onSaved: (winner: string, loser: string) => void;
}) {
  const { t } = useI18n();
  return (
    <OverlayFrame
      spinSeconds={SPIN_QUICK_ENTRY_S}
      topBar={
        <>
          <IconButton size="lg" onClick={onClose} aria-label={t.game.cancel}>
            <CloseIcon />
          </IconButton>
          <span />
          <span />
        </>
      }
    >
      <ResultSheet players={players} durationS={0} onCancel={onClose} onSaved={onSaved} />
    </OverlayFrame>
  );
}
