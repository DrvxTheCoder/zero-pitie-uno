// Plain, serialisable shapes passed from server components to client components.
// All timestamps are epoch milliseconds.

export type LeagueDTO = {
  id: string;
  name: string;
  createdAt: number;
};

export type PlayerDTO = {
  id: string;
  name: string;
  active: boolean;
  createdAt: number;
};

export type GameDTO = {
  id: string;
  winnerId: string;
  loserId: string;
  playedAt: number;
  durationS: number;
};

export type LeagueSnapshot = {
  league: LeagueDTO;
  players: PlayerDTO[];
  games: GameDTO[];
};

/** Error codes returned by server actions; translated in lib/i18n. */
export type ErrorCode =
  | "bad_login"
  | "name_taken"
  | "short_password"
  | "bad_name"
  | "same_player"
  | "unauthorized"
  | "too_many"
  | "signup_closed"
  | "generic";

export type ActionResult = { ok: true } | { ok: false; error: ErrorCode };
