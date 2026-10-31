"use server";

import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { runAction } from "@/lib/server/action";
import { leagueTag } from "@/lib/server/queries";
import { requireLeagueAction } from "@/lib/server/session";
import { cleanName, fail, nameKey } from "@/lib/server/validation";

async function assertNameFree(leagueId: string, name: string, exceptId?: string) {
  const others = await db.player.findMany({ where: { leagueId }, select: { id: true, name: true } });
  if (others.some((p) => p.id !== exceptId && nameKey(p.name) === nameKey(name))) fail("name_taken");
}

export async function addPlayer(name: string) {
  return runAction(async () => {
    const league = await requireLeagueAction();
    const clean = cleanName(name);
    await assertNameFree(league.id, clean);
    await db.player.create({ data: { leagueId: league.id, name: clean } });
    updateTag(leagueTag(league.id));
  });
}

export async function renamePlayer(playerId: string, name: string) {
  return runAction(async () => {
    const league = await requireLeagueAction();
    const clean = cleanName(name);
    await assertNameFree(league.id, clean, playerId);
    const { count } = await db.player.updateMany({ where: { id: playerId, leagueId: league.id }, data: { name: clean } });
    if (!count) fail("generic");
    updateTag(leagueTag(league.id));
  });
}

export async function setPlayerActive(playerId: string, active: boolean) {
  return runAction(async () => {
    const league = await requireLeagueAction();
    await db.player.updateMany({ where: { id: playerId, leagueId: league.id }, data: { active } });
    updateTag(leagueTag(league.id));
  });
}
