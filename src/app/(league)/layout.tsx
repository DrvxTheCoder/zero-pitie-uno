import type { ReactNode } from "react";
import { GameProvider } from "@/components/game/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { getLeagueSnapshot } from "@/lib/server/queries";
import { requireLeaguePage } from "@/lib/server/session";

/** Everything behind the league login: header, phone nav, and the game overlay. */
export default async function LeagueLayout({ children }: { children: ReactNode }) {
  const league = await requireLeaguePage();
  const { players } = await getLeagueSnapshot(league);
  const pickable = players.filter((p) => p.active).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <GameProvider leagueName={league.name} players={pickable}>
      <AppShell>
        <Header leagueName={league.name} />
        {children}
      </AppShell>
      <BottomNav />
    </GameProvider>
  );
}
