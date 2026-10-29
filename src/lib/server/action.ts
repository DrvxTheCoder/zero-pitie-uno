import "server-only";
import type { ActionResult } from "@/lib/types";
import { ActionError } from "./validation";

/** Run an action body and turn ActionErrors into `{ ok: false, error }`. */
export async function runAction(body: () => Promise<void>): Promise<ActionResult> {
  try {
    await body();
    return { ok: true };
  } catch (e) {
    if (e instanceof ActionError) return { ok: false, error: e.code };
    console.error(e);
    return { ok: false, error: "generic" };
  }
}
