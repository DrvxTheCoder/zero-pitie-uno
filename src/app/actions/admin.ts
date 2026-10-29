"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { runAction } from "@/lib/server/action";
import { hashPassword, verifyPassword } from "@/lib/server/passwords";
import { assertNotThrottled, recordFailure } from "@/lib/server/rate-limit";
import { endAdminSession, requireAdminAction, startAdminSession } from "@/lib/server/session";
import { checkPasswordLength, cleanName, fail, nameKey } from "@/lib/server/validation";

export async function loginAdmin(username: string, password: string) {
  return runAction(async () => {
    await assertNotThrottled();
    const admin = await db.admin.findUnique({ where: { username: String(username ?? "").trim() } });
    if (!admin || !verifyPassword(String(password ?? ""), admin.passHash)) {
      await recordFailure();
      fail("bad_login");
    }
    await startAdminSession(admin!.id);
  });
}

export async function logoutAdmin() {
  return runAction(endAdminSession);
}

export async function adminCreateLeague(name: string, password: string) {
  return runAction(async () => {
    await requireAdminAction();
    const clean = cleanName(name);
    const pw = checkPasswordLength(password);
    if (await db.league.findUnique({ where: { nameKey: nameKey(clean) } })) fail("name_taken");
    await db.league.create({ data: { name: clean, nameKey: nameKey(clean), passHash: hashPassword(pw) } });
    revalidatePath("/admin");
  });
}

/** Changing the password also logs out every device of that league. */
export async function adminSetLeaguePassword(leagueId: string, password: string) {
  return runAction(async () => {
    await requireAdminAction();
    const pw = checkPasswordLength(password);
    await db.$transaction([
      db.league.update({ where: { id: leagueId }, data: { passHash: hashPassword(pw) } }),
      db.session.deleteMany({ where: { leagueId } }),
    ]);
  });
}

export async function adminDeleteLeague(leagueId: string) {
  return runAction(async () => {
    await requireAdminAction();
    await db.league.deleteMany({ where: { id: leagueId } });
    revalidatePath("/", "layout");
  });
}

/** Deletes the player and every game they played. */
export async function adminDeletePlayer(playerId: string) {
  return runAction(async () => {
    await requireAdminAction();
    await db.player.deleteMany({ where: { id: playerId } });
    revalidatePath("/", "layout");
  });
}
