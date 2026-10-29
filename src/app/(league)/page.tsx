import { BoardView } from "@/components/board/BoardView";
import { getLeagueSnapshot } from "@/lib/server/queries";
import { requireLeaguePage } from "@/lib/server/session";

export default async function BoardPage() {
  const snapshot = await getLeagueSnapshot(await requireLeaguePage());
  return <BoardView snapshot={snapshot} />;
}
