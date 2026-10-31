import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { GameDTO, LeagueDTO, LeagueSnapshot, PlayerDTO } from "@/lib/types";
import type { Game, League, Player } from "@/generated/prisma/client";

/* ---------- mappers: Prisma rows → serialisable DTOs ---------- */

export const toLeagueDTO = (l: League): LeagueDTO => ({ id: l.id, name: l.name, createdAt: l.createdAt.getTime() });
export const toPlayerDTO = (p: Player): PlayerDTO => ({ id: p.id, name: p.name, active: p.active, createdAt: p.createdAt.getTime() });
export const toGameDTO = (g: Game): GameDTO => ({
  id: g.id,
  winnerId: g.winnerId,
  loserId: g.loserId,
  playedAt: g.playedAt.getTime(),
  durationS: g.durationS,
});

/** Cache tag of everything a league's pages show. Actions that change league data must `updateTag` it. */
export const leagueTag = (leagueId: string) => `league:${leagueId}`;

/**
 * Everything a league's pages need, cached on the server across requests and devices until
 * the league's tag is invalidated. Takes the league from the session (read outside the cache).
 */
export async function getLeagueSnapshot(league: League): Promise<LeagueSnapshot> {
  return (await loadLeagueSnapshot(league.id)) ?? { league: toLeagueDTO(league), players: [], games: [] };
}

/** Not exported: callers go through the session so they can't read another league. No clock reads in here. */
async function loadLeagueSnapshot(leagueId: string): Promise<LeagueSnapshot | null> {
  "use cache";
  cacheTag(leagueTag(leagueId));
  // Invalidation is tag-driven; the timers are only a safety net. `stale` matches staleTimes.dynamic.
  cacheLife({ stale: 30, revalidate: 86_400, expire: 604_800 });
  const [league, players, games] = await Promise.all([
    db.league.findUnique({ where: { id: leagueId } }),
    db.player.findMany({ where: { leagueId }, orderBy: { createdAt: "asc" } }),
    db.game.findMany({ where: { leagueId }, orderBy: { playedAt: "asc" } }),
  ]);
  if (!league) return null;
  return { league: toLeagueDTO(league), players: players.map(toPlayerDTO), games: games.map(toGameDTO) };
}

export type AdminOverview = {
  leagues: Array<LeagueDTO & { playerCount: number; gameCount: number }>;
  players: Array<PlayerDTO & { leagueId: string }>;
  games: Array<GameDTO & { leagueId: string }>;
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const [leagues, players, games] = await Promise.all([
    db.league.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { players: true, games: true } } } }),
    db.player.findMany({ orderBy: { createdAt: "asc" } }),
    db.game.findMany(),
  ]);
  return {
    leagues: leagues.map((l) => ({ ...toLeagueDTO(l), playerCount: l._count.players, gameCount: l._count.games })),
    players: players.map((p) => ({ ...toPlayerDTO(p), leagueId: p.leagueId })),
    games: games.map((g) => ({ ...toGameDTO(g), leagueId: g.leagueId })),
  };
}
