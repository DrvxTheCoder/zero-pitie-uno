import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, parseLang } from ".";

export async function getLang() {
  return parseLang((await cookies()).get(LANG_COOKIE)?.value);
}
