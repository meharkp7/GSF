import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";

// Lazy singleton — only instantiated on first use (not at build time).
// This avoids the "DATABASE_URL not set" error during Next.js static page collection.
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (_db) return _db;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Add it in Vercel → Project Settings → Environment Variables."
    );
  }

  // max:1 for Vercel serverless to avoid connection pool exhaustion
  const client = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    max: 1,
  });

  _db = drizzle(client, { schema });
  return _db;
}

// Re-export as a Proxy so callers can use `db.select(...)` unchanged
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as never)[prop as keyof ReturnType<typeof drizzle>];
  },
});
