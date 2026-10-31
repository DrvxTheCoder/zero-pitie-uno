"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useGame } from "@/components/game/GameProvider";
import { LogoutIcon, PlayIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav";

const itemClass =
  "grid min-w-0 justify-items-center gap-[3px] border-0 bg-transparent py-1 font-display text-[9px] tracking-normal uppercase [&_svg]:size-6";

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn(itemClass, active ? "text-yellow" : "text-paper")}>
      {children}
    </Link>
  );
}

/** Thumb navigation for phones (hidden from 860px). Big yellow PLAY button in the middle. */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { start } = useGame();
  const logout = useLogout();
  const [board, history, players] = NAV_ITEMS;

  const link = (item: (typeof NAV_ITEMS)[number]) => (
    <NavLink href={item.href} active={pathname === item.href}>
      <item.Icon />
      {t.nav[item.key]}
    </NavLink>
  );

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 items-end gap-x-1.5 bg-ink desk:hidden",
        "pt-2 pr-[max(8px,env(safe-area-inset-right,0px))] pb-[calc(8px+env(safe-area-inset-bottom,0px))] pl-[max(8px,env(safe-area-inset-left,0px))]",
      )}
    >
      {link(board)}
      {link(history)}
      <button
        type="button"
        onClick={start}
        aria-label={t.game.start}
        className="grid min-w-0 justify-items-center gap-1 border-0 bg-transparent font-display text-[9px] tracking-normal text-yellow uppercase"
      >
        <i className="-mt-[34px] grid size-[66px] -rotate-8 place-items-center rounded-full border-4 border-ink bg-yellow text-ink shadow-[0_0_0_3px_var(--color-yellow)]">
          <PlayIcon className="ml-[3px] size-[30px]" />
        </i>
        {/* {t.nav.play} */}
      </button>
      {link(players)}
      <button type="button" onClick={logout} aria-label={t.auth.logout} className={cn(itemClass, "text-paper")}>
        <LogoutIcon />
        {t.nav.exit}
      </button>
    </nav>
  );
}
