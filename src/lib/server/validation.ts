import "server-only";
import { NAME_MAX, PASSWORD_MIN } from "@/lib/constants";
import type { ErrorCode } from "@/lib/types";

export class ActionError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

export const fail = (code: ErrorCode): never => {
  throw new ActionError(code);
};

/** Trim, collapse spaces, enforce 1–40 characters. */
export function cleanName(value: unknown) {
  const name = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!name || name.length > NAME_MAX) fail("bad_name");
  return name;
}

/** Case-insensitive key used for uniqueness checks. */
export const nameKey = (name: string) => name.toLocaleLowerCase("fr");

export function checkPasswordLength(value: unknown) {
  const pw = String(value ?? "");
  if (pw.length < PASSWORD_MIN) fail("short_password");
  return pw;
}
