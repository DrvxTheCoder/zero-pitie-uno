import { OfflineCard } from "@/components/pwa/OfflineCard";
import { AppShell } from "@/components/layout/AppShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { HeroTitle } from "@/components/layout/Logo";

/** Served by the service worker when a page can't be reached. */
export default function OfflinePage() {
  return (
    <AppShell>
      <AuthLayout hero={<HeroTitle top="ZÉRO" bottom="PITIÉ" />}>
        <OfflineCard />
      </AuthLayout>
    </AppShell>
  );
}
