import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type Lang = "fr" | "en";
export type { Dictionary };

export const LANG_COOKIE = "zp_lang";
export const DEFAULT_LANG: Lang = "fr";

const dictionaries: Record<Lang, Dictionary> = { fr, en };

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

export function parseLang(value: string | undefined | null): Lang {
  return value === "en" ? "en" : DEFAULT_LANG;
}
