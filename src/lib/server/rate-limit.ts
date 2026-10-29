import "server-only";
import { headers } from "next/headers";
import { fail } from "./validation";

// In-memory login throttle: 10 failed attempts per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 10;
const failures = new Map<string, { count: number; since: number }>();

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

export async function assertNotThrottled() {
  const entry = failures.get(await clientIp());
  if (entry && entry.count >= MAX_FAILS && Date.now() - entry.since < WINDOW_MS) fail("too_many");
}

export async function recordFailure() {
  const ip = await clientIp();
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.since > WINDOW_MS) failures.set(ip, { count: 1, since: Date.now() });
  else entry.count++;
}
