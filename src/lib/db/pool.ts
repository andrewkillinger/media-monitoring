import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "Missing DATABASE_URL environment variable. " +
          "Set it to a PostgreSQL connection string, e.g. postgresql://acadia:acadia@localhost:5432/media_monitoring"
      );
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}
