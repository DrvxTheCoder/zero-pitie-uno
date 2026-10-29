"use client";

import { useState, useTransition, type FormEvent } from "react";
import { adminCreateLeague } from "@/app/actions/admin";
import { useI18n } from "@/components/providers/I18nProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { ErrorBox, Input } from "@/components/ui/Form";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import { NAME_MAX, PASSWORD_MIN } from "@/lib/constants";

export function CreateLeagueForm() {
  const { t } = useI18n();
  const toast = useToast();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const res = await adminCreateLeague(String(data.get("name") ?? ""), String(data.get("password") ?? ""));
      if (!res.ok) return setError(t.errors[res.error]);
      setError("");
      form.reset();
      toast(t.admin.leagueCreated);
    });
  }

  return (
    <Panel stack>
      <Tape>{t.admin.createLeague}</Tape>
      <form onSubmit={submit} className="grid min-w-0 gap-2.5">
        <Input id="acName" name="name" placeholder={t.admin.leagueName} maxLength={NAME_MAX} required autoComplete="off" />
        <Input id="acPass" name="password" type="text" placeholder={t.admin.password} minLength={PASSWORD_MIN} required autoComplete="off" />
        <Button type="submit" variant="yellow" disabled={pending}>
          {t.admin.create}
        </Button>
      </form>
      {error && <ErrorBox>{error}</ErrorBox>}
    </Panel>
  );
}
