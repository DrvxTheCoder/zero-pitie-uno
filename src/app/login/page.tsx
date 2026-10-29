import { redirect } from "next/navigation";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { HeroSubtitle } from "@/components/auth/HeroSubtitle";
import { LeagueAuthForm } from "@/components/auth/LeagueAuthForm";
import { AppShell } from "@/components/layout/AppShell";
import { HeroTitle } from "@/components/layout/Logo";
import { getCurrentLeague } from "@/lib/server/session";

export default async function LoginPage() {
  if (await getCurrentLeague()) redirect("/");
  return (
    <AppShell>
      <AuthLayout
        hero={
          <>
            <HeroTitle top="ZÉRO" bottom="PITIÉ" />
            <HeroSubtitle />
          </>
        }
        footer={<AuthFooter />}
      >
        <LeagueAuthForm />
      </AuthLayout>
    </AppShell>
  );
}
