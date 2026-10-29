"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function OfflineCard() {
  const { t } = useI18n();
  return (
    <EmptyState
      title={t.offline.title}
      subtitle={t.offline.body}
      action={
        <Button variant="yellow" onClick={() => location.reload()}>
          {t.offline.retry}
        </Button>
      }
    />
  );
}
