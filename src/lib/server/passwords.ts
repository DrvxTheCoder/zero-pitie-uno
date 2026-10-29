import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** "salt:hash" (hex), scrypt with a random 16-byte salt. */
export function hashPassword(password: string) {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 32).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = scryptSync(password, Buffer.from(salt, "hex"), 32);
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function newToken() {
  return randomBytes(32).toString("base64url");
}
