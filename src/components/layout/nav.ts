import { ClockIcon, TrophyIcon, UsersIcon } from "@/components/icons";

export const NAV_ITEMS = [
  { href: "/", key: "board", Icon: TrophyIcon },
  { href: "/history", key: "history", Icon: ClockIcon },
  { href: "/players", key: "players", Icon: UsersIcon },
] as const;
