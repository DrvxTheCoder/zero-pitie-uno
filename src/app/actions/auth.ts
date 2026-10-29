"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";
import { runAction } from "@/lib/server/action";
import { hashPassword, verifyPassword } from "@/lib/server/passwords";
import { assertNotThrottled, recordFailure } from "@/lib/server/rate-limit";
import { endLeagueSession, startLeagueSession } from "@/lib/server/session";
import { checkPasswordLength, cleanName, fail, nameKey } from "@/lib/server/validation";

export async function loginLeague(name: string, password: string) {
  return runAction(async () => {
    await assertNotThrottled();
    const key = nameKey(cleanName(name));
    const league = await db.league.findUnique({ where: { nameKey: key } });
    if (!league || !verifyPassword(String(password ?? ""), league.passHash)) {
      await recordFailure();
      fail("bad_login");
    }
    await startLeagueSession(league!.id);
  });
}

export async function registerLeague(name: string, password: string) {
  return runAction(async () => {
    if (process.env.ALLOW_SIGNUP === "false") fail("signup_closed");
    const clean = cleanName(name);
    const pw = checkPasswordLength(password);
    if (await db.league.findUnique({ where: { nameKey: nameKey(clean) } })) fail("name_taken");
    const league = await db.league.create({ data: { name: clean, nameKey: nameKey(clean), passHash: hashPassword(pw) } });
    await startLeagueSession(league.id);
  });
}

export async function logoutLeague() {
  return runAction(endLeagueSession);
}

export async function setLanguage(lang: Lang) {
  (await cookies()).set(LANG_COOKIE, lang === "en" ? "en" : "fr", { path: "/", maxAge: 365 * 86400, sameSite: "lax" });
}
