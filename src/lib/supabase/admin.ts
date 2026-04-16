import { createDbClient } from "../db";

/**
 * Bridge: createAdminClient() now delegates to the local PostgreSQL client.
 * Pipeline code (ingest.ts, classify.ts, builder.ts) can keep importing this
 * function with zero changes.
 */
export function createAdminClient() {
  return createDbClient();
}
