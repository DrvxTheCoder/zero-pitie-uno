"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/components/game/GameProvider";
import { DownloadIcon, LogoutIcon, TrophyIcon } from "@/components/icons";
import { useI18n } from "@/components/providers/I18nProvider";
import { Chip } from "@/components/ui/Chip";
import { IconButton } from "@/components/ui/IconButton";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "./nav";

const tabClass =
  "rounded-[12px] border-3 border-ink px-[14px] py-2 font-display text-[13px] uppercase shadow-ink-3 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

/** Desktop tabs, shown from 860px; phones use <BottomNav>. */
function DesktopTabs() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { start } = useGame();
  return (
    <nav className="hidden gap-2 desk:flex">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={cn(tabClass, pathname === item.href ? "bg-yellow" : "bg-paper")}
        >
          {t.nav[item.key]}
        </Link>
      ))}
      <button type="button" onClick={start} className={cn(tabClass, "bg-ink text-yellow shadow-yellow-3")}>
        {t.game.start}
      </button>
    </nav>
  );
}

export function Header({ leagueName }: { leagueName: string }) {
  const { t, lang, toggleLang } = useI18n();
  const logout = useLogout();
  const install = useInstallPrompt();

  return (
    <header className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
      <Logo href="/" subtitle={t.tag} />
      <DesktopTabs />
      <div className="flex flex-wrap items-center gap-2">
        <Chip title={leagueName}>
          <TrophyIcon width={16} height={16} />
          <span className="truncate">{leagueName}</span>
        </Chip>
        {install && (
          <IconButton onClick={install} aria-label={t.common.install} title={t.common.install}>
            <DownloadIcon />
          </IconButton>
        )}
        <IconButton onClick={toggleLang} aria-label={t.common.language}>
          {lang === "fr" ? "EN" : "FR"}
        </IconButton>
        <IconButton onClick={logout} aria-label={t.auth.logout} title={t.auth.logout}>
          <LogoutIcon />
        </IconButton>
      </div>
    </header>
  );
}
