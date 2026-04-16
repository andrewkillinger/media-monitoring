import { getPool } from "./pool";
import { QueryBuilder } from "./query-builder";

/**
 * Create a database client with a Supabase-compatible query API.
 * Drop-in replacement for createAdminClient() — pipeline code needs no changes.
 */
export function createDbClient() {
  const pool = getPool();
  return {
    from(table: string) {
      return new QueryBuilder(pool, table);
    },
  };
}
