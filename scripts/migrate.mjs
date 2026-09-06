#!/usr/bin/env node
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("[db:migrate] DATABASE_URL is not set. Skipping migrations.");
  process.exit(0);
}

const migrationsFolder = resolve(process.cwd(), "drizzle");

if (!existsSync(migrationsFolder)) {
  console.warn(
    `[db:migrate] Migrations folder not found at ${migrationsFolder}. Skipping.`,
  );
  process.exit(0);
}

console.log(
  "[db:migrate] Connecting to database to check pending migrations...",
);

const pool = new Pool({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("[db:migrate] Database connection error:", err);
});

async function main() {
  const db = drizzle({ client: pool });
  try {
    await migrate(db, { migrationsFolder });
    console.log("[db:migrate] Migrations successfully applied!");
  } catch (error) {
    console.error("[db:migrate] Failed to apply migrations:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
