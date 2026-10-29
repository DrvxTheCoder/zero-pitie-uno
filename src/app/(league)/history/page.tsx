import { HistoryView } from "@/components/history/HistoryView";
import { getLeagueSnapshot } from "@/lib/server/queries";
import { requireLeaguePage } from "@/lib/server/session";

export default async function HistoryPage() {
  const snapshot = await getLeagueSnapshot(await requireLeaguePage());
  return <HistoryView snapshot={snapshot} />;
}
