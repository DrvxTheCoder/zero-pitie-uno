"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { runAction } from "@/lib/server/action";
import { requireLeagueAction } from "@/lib/server/session";
import { fail } from "@/lib/server/validation";

export async function recordGame(winnerId: string, loserId: string, durationS: number) {
  return runAction(async () => {
    const league = await requireLeagueAction();
    if (!winnerId || !loserId) fail("generic");
    if (winnerId === loserId) fail("same_player");
    const found = await db.player.count({ where: { leagueId: league.id, id: { in: [winnerId, loserId] } } });
    if (found !== 2) fail("generic");
    await db.game.create({
      data: {
        leagueId: league.id,
        winnerId,
        loserId,
        durationS: Math.max(0, Math.min(3600, Math.round(Number(durationS) || 0))),
      },
    });
    revalidatePath("/", "layout");
  });
}

export async function deleteGame(gameId: string) {
  return runAction(async () => {
    const league = await requireLeagueAction();
    await db.game.deleteMany({ where: { id: gameId, leagueId: league.id } });
    revalidatePath("/", "layout");
  });
}
