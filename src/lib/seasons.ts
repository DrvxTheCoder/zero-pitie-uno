import { DAY_MS, SEASON_MS } from "./constants";
import type { GameDTO } from "./types";

// Seasons are consecutive 30-day blocks starting at the league's creation time.
// Index 0 is "Season 1".

export function seasonIndex(ts: number, leagueCreatedAt: number) {
  return Math.floor((ts - leagueCreatedAt) / SEASON_MS);
}

export function seasonRange(index: number, leagueCreatedAt: number): [start: number, end: number] {
  const start = leagueCreatedAt + index * SEASON_MS;
  return [start, start + SEASON_MS];
}

export function gamesInSeason(games: GameDTO[], index: number, leagueCreatedAt: number) {
  const [start, end] = seasonRange(index, leagueCreatedAt);
  return games.filter((g) => g.playedAt >= start && g.playedAt < end);
}

/** Where `now` sits in its season. `dayNumber` is 0-based. */
export function seasonProgress(now: number, leagueCreatedAt: number) {
  const index = seasonIndex(now, leagueCreatedAt);
  const [start, end] = seasonRange(index, leagueCreatedAt);
  return {
    index,
    start,
    end,
    dayNumber: Math.floor((now - start) / DAY_MS),
    daysLeft: Math.ceil((end - now) / DAY_MS),
  };
}
