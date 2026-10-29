import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { newToken } from "./passwords";
import { fail } from "./validation";

const LEAGUE_COOKIE = "zp_s";
const ADMIN_COOKIE = "zp_a";
const LEAGUE_SESSION_DAYS = 180;
const ADMIN_SESSION_HOURS = 12;

async function cookieOptions(maxAgeSeconds: number) {
  const proto = (await headers()).get("x-forwarded-proto");
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
    secure: process.env.COOKIE_SECURE === "true" || proto === "https",
  };
}

/* ---------- league sessions ---------- */

export async function startLeagueSession(leagueId: string) {
  const token = newToken();
  await db.session.create({ data: { token, leagueId } });
  (await cookies()).set(LEAGUE_COOKIE, token, await cookieOptions(LEAGUE_SESSION_DAYS * 86400));
}

export async function endLeagueSession() {
  const jar = await cookies();
  const token = jar.get(LEAGUE_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { token } });
  jar.delete(LEAGUE_COOKIE);
}

/** The logged-in league, or null. Cached per request. */
export const getCurrentLeague = cache(async () => {
  const token = (await cookies()).get(LEAGUE_COOKIE)?.value;
  if (!token) return null;
  const minCreated = new Date(Date.now() - LEAGUE_SESSION_DAYS * 86_400_000);
  const session = await db.session.findFirst({
    where: { token, createdAt: { gt: minCreated } },
    include: { league: true },
  });
  return session?.league ?? null;
});

/** For pages: redirect to /login when logged out. */
export async function requireLeaguePage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/login");
  return league;
}

/** For server actions: throw "unauthorized" when logged out. */
export async function requireLeagueAction() {
  return (await getCurrentLeague()) ?? fail("unauthorized");
}

/* ---------- admin sessions ---------- */

export async function startAdminSession(adminId: string) {
  const token = newToken();
  await db.adminSession.create({ data: { token, adminId } });
  (await cookies()).set(ADMIN_COOKIE, token, await cookieOptions(ADMIN_SESSION_HOURS * 3600));
}

export async function endAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) await db.adminSession.deleteMany({ where: { token } });
  jar.delete(ADMIN_COOKIE);
}

export const getCurrentAdmin = cache(async () => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const minCreated = new Date(Date.now() - ADMIN_SESSION_HOURS * 3_600_000);
  const session = await db.adminSession.findFirst({
    where: { token, createdAt: { gt: minCreated } },
    include: { admin: true },
  });
  return session?.admin ?? null;
});

export async function requireAdminAction() {
  return (await getCurrentAdmin()) ?? fail("unauthorized");
}
