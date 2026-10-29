// Seeds the back-office admin account only.
// Reads ADMIN_USERNAME (default "admin") and ADMIN_PASSWORD from .env.
// Running it again updates that admin's password.
import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const username = (process.env.ADMIN_USERNAME || "admin").trim();
const password = process.env.ADMIN_PASSWORD || "";

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be set in .env (8 characters minimum).");
  process.exit(1);
}

// Same format as src/lib/server/passwords.ts
const salt = randomBytes(16);
const passHash = `${salt.toString("hex")}:${scryptSync(password, salt, 32).toString("hex")}`;

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

try {
  await db.admin.upsert({
    where: { username },
    create: { username, passHash },
    update: { passHash },
  });
} catch (err) {
  // P2021: table missing, i.e. the migrations were never applied to this database.
  if ((err as { code?: string }).code === "P2021") {
    console.error('Tables are missing. Apply the migrations first: "pnpm db:deploy" (or "pnpm setup" to migrate + seed).');
    await db.$disconnect();
    process.exit(1);
  }
  throw err;
}
console.log(`Admin "${username}" is ready.`);
await db.$disconnect();
