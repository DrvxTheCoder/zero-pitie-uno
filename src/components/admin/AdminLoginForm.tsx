"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/admin";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { ErrorBox, Field, Input } from "@/components/ui/Form";
import { Panel } from "@/components/ui/Panel";

export function AdminLoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAdmin(String(data.get("username") ?? ""), String(data.get("password") ?? ""));
      if (!res.ok) return setError(t.errors[res.error]);
      router.refresh();
    });
  }

  return (
    <Panel>
      <form onSubmit={submit} className="grid min-w-0 gap-[14px]">
        <Field label={t.admin.username} htmlFor="auser">
          <Input id="auser" name="username" required autoComplete="username" />
        </Field>
        <Field label={t.admin.password} htmlFor="apass">
          <Input id="apass" name="password" type="password" required autoComplete="current-password" />
        </Field>
        {error && <ErrorBox>{error}</ErrorBox>}
        <Button type="submit" variant="ink" className="w-full" disabled={pending}>
          {t.admin.enter}
        </Button>
      </form>
    </Panel>
  );
}
