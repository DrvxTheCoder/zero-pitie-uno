"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginLeague, registerLeague } from "@/app/actions/auth";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { ErrorBox, Field, Input } from "@/components/ui/Form";
import { Panel } from "@/components/ui/Panel";
import { NAME_MAX, PASSWORD_MIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";

function TabSwitch({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  const { t } = useI18n();
  const tab = (id: Tab, label: string) => (
    <button
      type="button"
      aria-pressed={value === id}
      onClick={() => onChange(id)}
      className={cn("border-0 p-2.5 font-display text-[13px] uppercase", value === id ? "bg-ink text-yellow" : "bg-paper")}
    >
      {label}
    </button>
  );
  return (
    <div role="group" className="mb-[14px] grid grid-cols-2 overflow-hidden rounded-[14px] border-3 border-ink">
      {tab("login", t.auth.login)}
      {tab("register", t.auth.register)}
    </div>
  );
}

/** League sign-in / new league, in one card with a tab switch. */
export function LeagueAuthForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const register = tab === "register";

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const password = String(data.get("password") ?? "");
    startTransition(async () => {
      const res = register ? await registerLeague(name, password) : await loginLeague(name, password);
      if (!res.ok) return setError(t.errors[res.error]);
      router.replace(register ? "/players" : "/");
      router.refresh();
    });
  }

  return (
    <Panel>
      <TabSwitch
        value={tab}
        onChange={(next) => {
          setTab(next);
          setError("");
        }}
      />
      <form key={tab} onSubmit={submit} className="grid min-w-0 gap-[14px]">
        <Field label={t.auth.leagueName} htmlFor="lname">
          <Input id="lname" name="name" required maxLength={NAME_MAX} autoComplete="username" />
        </Field>
        <Field label={t.auth.password} htmlFor="lpass">
          <Input
            id="lpass"
            name="password"
            type="password"
            required
            minLength={register ? PASSWORD_MIN : 1}
            autoComplete={register ? "new-password" : "current-password"}
          />
        </Field>
        {error && <ErrorBox>{error}</ErrorBox>}
        <Button type="submit" variant="yellow" className="w-full" disabled={pending}>
          {register ? t.auth.create : t.auth.enter}
        </Button>
      </form>
    </Panel>
  );
}
