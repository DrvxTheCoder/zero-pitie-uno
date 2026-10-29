"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";
import { Logo } from "@/components/layout/Logo";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button, buttonClasses } from "@/components/ui/Button";

/** Back-office stamp, "back to app" and logout. */
export function AdminHeader({ hasLeagueSession }: { hasLeagueSession: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <header className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
      <Logo title="BACK-OFFICE" subtitle="ZÉRO PITIÉ" />
      <div className="flex flex-wrap items-center gap-2">
        <BackLink hasLeagueSession={hasLeagueSession} />
        <Button
          size="sm"
          variant="ink"
          onClick={async () => {
            await logoutAdmin();
            router.refresh();
          }}
        >
          {t.admin.logout}
        </Button>
      </div>
    </header>
  );
}

export function BackLink({ hasLeagueSession }: { hasLeagueSession: boolean }) {
  const { t } = useI18n();
  return (
    <Link href={hasLeagueSession ? "/" : "/login"} className={buttonClasses("paper", "sm")}>
      {hasLeagueSession ? t.admin.backToApp : t.admin.back}
    </Link>
  );
}
