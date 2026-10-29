import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BackLink } from "@/components/admin/AdminHeader";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AppShell } from "@/components/layout/AppShell";
import { HeroTitle } from "@/components/layout/Logo";
import { getAdminOverview } from "@/lib/server/queries";
import { getCurrentAdmin, getCurrentLeague } from "@/lib/server/session";

export const metadata: Metadata = { title: "Back-office · Zéro Pitié" };

export default async function AdminPage() {
  const [admin, league] = await Promise.all([getCurrentAdmin(), getCurrentLeague()]);

  if (!admin) {
    return (
      <AppShell>
        <AuthLayout
          hero={<HeroTitle top="BACK" bottom="OFFICE" small />}
          footer={
            <div className="flex justify-center">
              <BackLink hasLeagueSession={!!league} />
            </div>
          }
        >
          <AdminLoginForm />
        </AuthLayout>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AdminDashboard data={await getAdminOverview()} hasLeagueSession={!!league} />
    </AppShell>
  );
}
