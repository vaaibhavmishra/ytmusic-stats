import { drizzle } from "drizzle-orm/node-postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable (see .env.example)",
  );
}

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
});
