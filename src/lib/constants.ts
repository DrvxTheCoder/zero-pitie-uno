export const DAY_MS = 86_400_000;
export const SEASON_DAYS = 30;
export const SEASON_MS = SEASON_DAYS * DAY_MS;

/** Game length, in minutes: picked before each game and remembered per device. */
export const GAME_MINUTES_MIN = 1;
export const GAME_MINUTES_MAX = 10;
export const GAME_MINUTES_DEFAULT = 5;
export const GAME_MINUTES_QUICK = [1, 3, 5, 10] as const;

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
