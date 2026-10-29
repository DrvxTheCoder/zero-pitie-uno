import "server-only";
import { cache } from "react";
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

/** Everything a league's pages need. Cached per request. */
export const getLeagueSnapshot = cache(async (league: League): Promise<LeagueSnapshot> => {
  const [players, games] = await Promise.all([
    db.player.findMany({ where: { leagueId: league.id }, orderBy: { createdAt: "asc" } }),
    db.game.findMany({ where: { leagueId: league.id }, orderBy: { playedAt: "asc" } }),
  ]);
  return { league: toLeagueDTO(league), players: players.map(toPlayerDTO), games: games.map(toGameDTO) };
});

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
