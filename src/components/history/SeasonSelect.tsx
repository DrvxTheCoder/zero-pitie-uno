"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { Select } from "@/components/ui/Select";

/** "current" = the running season, a number = a past season index, "all" = everything. */
export type SeasonFilter = "current" | "all" | number;

export function SeasonSelect({
  value,
  onChange,
  currentSeason,
}: {
  value: SeasonFilter;
  onChange: (v: SeasonFilter) => void;
  currentSeason: number;
}) {
  const { t } = useI18n();
  const encode = (v: SeasonFilter) => String(v);
  const decode = (s: string): SeasonFilter => (s === "all" || s === "current" ? s : Number(s));

  return (
    <Select
      id="histSeason"
      compact
      value={encode(value)}
      onChange={(v) => onChange(decode(v))}
      options={[
        { value: "all", label: t.history.allSeasons },
        ...Array.from({ length: currentSeason + 1 }, (_, k) => currentSeason - k).map((i) => ({
          value: i === currentSeason ? "current" : String(i),
          label: `${t.season.title} ${i + 1}`,
        })),
      ]}
    />
  );
}
