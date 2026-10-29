import { PLAYER_COLORS } from "./constants";
import { gamesInSeason } from "./seasons";
import type { GameDTO, PlayerDTO } from "./types";

export type Standing = {
  player: PlayerDTO;
  wins: number;
  losses: number;
  games: number;
  diff: number;
  /** Positive = consecutive wins, negative = consecutive losses (most recent run). */
  streak: number;
};

/**
 * Standings for a set of games: +1 per win, −1 per loss.
 * Includes active players and archived players who played in these games.
 * Order: best diff, then more wins, then fewer games, then name.
 */
export function computeStandings(games: GameDTO[], players: PlayerDTO[]): Standing[] {
  const map = new Map<string, Standing>(
    players.map((p) => [p.id, { player: p, wins: 0, losses: 0, games: 0, diff: 0, streak: 0 }]),
  );

  for (const g of [...games].sort((a, b) => a.playedAt - b.playedAt)) {
    const w = map.get(g.winnerId);
    const l = map.get(g.loserId);
    if (w) {
      w.wins++; w.games++; w.diff++;
      w.streak = w.streak > 0 ? w.streak + 1 : 1;
    }
    if (l) {
      l.losses++; l.games++; l.diff--;
      l.streak = l.streak < 0 ? l.streak - 1 : -1;
    }
  }

  return [...map.values()]
    .filter((s) => s.player.active || s.games > 0)
    .sort(
      (a, b) =>
        b.diff - a.diff ||
        b.wins - a.wins ||
        a.games - b.games ||
        a.player.name.localeCompare(b.player.name),
    );
}

export function winRate(s: Standing) {
  return s.games ? Math.round((s.wins / s.games) * 100) : 0;
}

/** Champion of every finished season, most recent first. */
export function pastChampions(
  games: GameDTO[],
  players: PlayerDTO[],
  leagueCreatedAt: number,
  currentIndex: number,
) {
  const out: Array<{ seasonIndex: number; standing: Standing }> = [];
  for (let i = currentIndex - 1; i >= 0; i--) {
    const top = computeStandings(gamesInSeason(games, i, leagueCreatedAt), players).find((s) => s.games > 0);
    if (top) out.push({ seasonIndex: i, standing: top });
  }
  return out;
}

/** Avatar colour for a player, by creation order within the league. */
export function playerColor(players: PlayerDTO[], playerId: string) {
  const i = players.findIndex((p) => p.id === playerId);
  return PLAYER_COLORS[(i < 0 ? 0 : i) % PLAYER_COLORS.length];
}
