"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { addPlayer } from "@/app/actions/players";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { ErrorBox, Input } from "@/components/ui/Form";
import { Panel } from "@/components/ui/Panel";
import { Tape } from "@/components/ui/Tape";
import { NAME_MAX } from "@/lib/constants";

export function AddPlayerForm() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await addPlayer(name);
      if (!res.ok) return setError(t.errors[res.error]);
      setError("");
      setName("");
      input.current?.focus();
    });
  }

  return (
    <Panel stack>
      <Tape>{t.players.add}</Tape>
      <form onSubmit={submit} className="flex flex-wrap gap-2.5">
        <Input
          ref={input}
          id="newPlayer"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.players.name}
          maxLength={NAME_MAX}
          required
          autoComplete="off"
          className="flex-[1_1_200px]"
        />
        <Button type="submit" variant="yellow" disabled={pending}>
          {t.players.addBtn}
        </Button>
      </form>
      {error && <ErrorBox>{error}</ErrorBox>}
    </Panel>
  );
}
