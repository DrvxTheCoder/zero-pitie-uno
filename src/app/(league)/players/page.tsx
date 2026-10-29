import { PlayersView } from "@/components/players/PlayersView";
import { getLeagueSnapshot } from "@/lib/server/queries";
import { requireLeaguePage } from "@/lib/server/session";

export default async function PlayersPage() {
  const snapshot = await getLeagueSnapshot(await requireLeaguePage());
  return <PlayersView snapshot={snapshot} />;
}
