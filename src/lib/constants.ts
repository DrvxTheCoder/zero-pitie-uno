export const DAY_MS = 86_400_000;
export const SEASON_DAYS = 30;
export const SEASON_MS = SEASON_DAYS * DAY_MS;

/** Length of one game, in milliseconds. */
export const GAME_MS = 5 * 60 * 1000;

/** Avatar colours, assigned by player creation order. */
export const PLAYER_COLORS = [
  "#FFD319", "#1769C7", "#22A04A", "#F07F12",
  "#151012", "#7B3FC4", "#0E9C9C", "#D41E24",
] as const;

/** Name length limit for leagues and players. */
export const NAME_MAX = 40;
export const PASSWORD_MIN = 4;

/** How often league pages re-fetch data while visible. */
export const REFRESH_MS = 20_000;
