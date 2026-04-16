import { createAdminClient } from "../supabase/admin";
import { getAdapter } from "../adapters/registry";
import type { AdapterConfig } from "../adapters/types";
import type { SourceAdapterRow, ArticleInsert, IngestionRunInsert, IngestionRunUpdate, SourceAdapterUpdate } from "../supabase/types";
import { normalizeTitle, normalizeUrl, extractSnippet, detectLanguage } from "./normalize";
import { isDuplicateByUrl, isSimilarTitle, findCluster } from "./dedup";
import type { ClusterCandidate } from "./dedup";

// ─── Result types ─────────────────────────────────────────────────────────────

export interface IngestResult {
  sourceAdapterId: string;
  runId: string;
  itemsFetched: number;
  itemsNew: number;
  itemsDuplicate: number;
  itemsError: number;
  errors: string[];
  durationMs: number;
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

/**
 * Run ingestion for one or all active source adapters.
 *
 * @param sourceId  Optional UUID — if provided, only that adapter is run.
 *                  If omitted, all active adapters are processed.
 */
export async function runIngestion(sourceId?: string): Promise<IngestResult[]> {
  const db = createAdminClient();

  // Fetch adapter configs
  let query = db
    .from("source_adapters")
    .select("*")
    .eq("is_active", true);

  if (sourceId) {
    query = query.eq("id", sourceId) as typeof query;
  }

  const { data: adapters, error: adapterError } = await query;

  if (adapterError) {
    throw new Error(`Failed to load source adapters: ${adapterError.message}`);
  }

  const results: IngestResult[] = [];

  for (const adapterRow of adapters ?? []) {
    const result = await runSingleAdapterIngestion(adapterRow);
    results.push(result);
  }

  return results;
}

// ─── Per-adapter ingestion ────────────────────────────────────────────────────

async function runSingleAdapterIngestion(
  adapterRow: SourceAdapterRow
): Promise<IngestResult> {
  const startedAt = Date.now();
  const db = createAdminClient();

  // Create an ingestion_run record
  const runInsert: IngestionRunInsert = {
    source_adapter_id: adapterRow.id,
    status: "running",
  };
  const { data: runData, error: runError } = await db
    .from("ingestion_runs")
    .insert(runInsert)
    .select("id")
    .single();

  if (runError || !runData) {
    throw new Error(`Failed to create ingestion run: ${runError?.message}`);
  }

  const runId = runData.id;
  let itemsFetched = 0;
  let itemsNew = 0;
  let itemsDuplicate = 0;
  let itemsError = 0;
  const errors: string[] = [];

  try {
    const adapter = getAdapter(adapterRow.adapter_type);
    if (!adapter) {
      throw new Error(`No adapter registered for type: ${adapterRow.adapter_type}`);
    }

    const config: AdapterConfig = {
      id: adapterRow.id,
      type: adapterRow.adapter_type,
      name: adapterRow.name,
      settings: adapterRow.settings as Record<string, unknown>,
      credentials: adapterRow.credentials_encrypted as Record<string, unknown> | null,
      lastCursor: adapterRow.last_cursor ?? undefined,
      isActive: adapterRow.is_active,
    };

    // Fetch from the source
    const fetchResult = await adapter.fetch(config, adapterRow.last_cursor ?? undefined);
    itemsFetched = fetchResult.items.length;

    if (fetchResult.errors?.length) {
      errors.push(...fetchResult.errors.map((e) => e.message));
      itemsError += fetchResult.errors.length;
    }

    if (fetchResult.items.length > 0) {
      // Load existing URL hashes for dedup
      const existingHashes = await loadExistingUrlHashes(db);

      // Load recent articles for cluster detection
      const recentArticles = await loadRecentArticlesForClustering(db);

      for (const item of fetchResult.items) {
        try {
          const normalizedUrl = normalizeUrl(item.url);
          const titleNormalized = normalizeTitle(item.title);

          // Quick URL-based dedup check (hash comparison done in DB via unique constraint)
          const isDup = await checkUrlExists(db, normalizedUrl);
          if (isDup) {
            itemsDuplicate++;
            continue;
          }

          // Detect language if not provided
          const language =
            item.language ??
            (item.bodyText ? detectLanguage(item.bodyText) : "en");

          // Find cluster
          const clusterMatch = findCluster(
            {
              title: item.title,
              title_normalized: titleNormalized,
              published_at: item.publishedAt ?? null,
            },
            recentArticles
          );

          // Build insert payload
          const articleInsert: ArticleInsert = {
            source_adapter_id: adapterRow.id,
            ingestion_run_id: runId,
            external_id: item.externalId,
            url: normalizedUrl,
            title: item.title,
            title_normalized: titleNormalized,
            author: item.author ?? null,
            outlet_name_raw: item.outletName ?? null,
            published_at: item.publishedAt ?? null,
            body_snippet: item.bodyText
              ? extractSnippet(item.bodyText, 1000)
              : null,
            language,
            region: item.region ?? null,
            media_type: item.mediaType ?? null,
            status: "pending",
            is_syndicated: Boolean(clusterMatch),
            cluster_id: clusterMatch?.clusterId ?? null,
            metadata: item.metadata ?? {},
          };

          const { error: insertError } = await db
            .from("articles")
            .insert(articleInsert);

          if (insertError) {
            // Unique constraint violation = duplicate URL
            if (insertError.code === "23505") {
              itemsDuplicate++;
            } else {
              errors.push(
                `Failed to insert article "${item.title}": ${insertError.message}`
              );
              itemsError++;
            }
          } else {
            itemsNew++;
          }
        } catch (err) {
          errors.push(
            `Error processing item "${item.title}": ${(err as Error).message}`
          );
          itemsError++;
        }
      }
    }

    // Update adapter's last_fetched_at and last_cursor
    const adapterUpdate: SourceAdapterUpdate = {
      last_fetched_at: new Date().toISOString(),
      last_cursor: fetchResult.cursor ?? adapterRow.last_cursor,
      updated_at: new Date().toISOString(),
    };
    await db
      .from("source_adapters")
      .update(adapterUpdate)
      .eq("id", adapterRow.id);

    // Mark run as completed
    const completedUpdate: IngestionRunUpdate = {
      status: "completed",
      completed_at: new Date().toISOString(),
      items_fetched: itemsFetched,
      items_new: itemsNew,
      items_duplicate: itemsDuplicate,
      items_error: itemsError,
      error_message: errors.length > 0 ? errors.slice(0, 3).join("; ") : null,
    };
    await db
      .from("ingestion_runs")
      .update(completedUpdate)
      .eq("id", runId);
  } catch (err) {
    const errMsg = (err as Error).message;
    errors.push(errMsg);

    // Mark run as failed
    const failedUpdate: IngestionRunUpdate = {
      status: "failed",
      completed_at: new Date().toISOString(),
      items_fetched: itemsFetched,
      items_new: itemsNew,
      items_duplicate: itemsDuplicate,
      items_error: itemsError,
      error_message: errMsg.slice(0, 500),
    };
    await db
      .from("ingestion_runs")
      .update(failedUpdate)
      .eq("id", runId);
  }

  return {
    sourceAdapterId: adapterRow.id,
    runId,
    itemsFetched,
    itemsNew,
    itemsDuplicate,
    itemsError,
    errors,
    durationMs: Date.now() - startedAt,
  };
}

// ─── Database helpers ─────────────────────────────────────────────────────────

async function loadExistingUrlHashes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: ReturnType<typeof createAdminClient>
): Promise<Set<string>> {
  // Only load recent hashes to keep memory reasonable
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await db
    .from("articles")
    .select("url_hash")
    .gte("created_at", since);

  return new Set((data ?? []).map((r) => r.url_hash));
}

async function checkUrlExists(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: ReturnType<typeof createAdminClient>,
  url: string
): Promise<boolean> {
  const { data } = await db
    .from("articles")
    .select("id")
    .eq("url", url)
    .limit(1);

  return Boolean(data && data.length > 0);
}

async function loadRecentArticlesForClustering(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: ReturnType<typeof createAdminClient>
): Promise<ClusterCandidate[]> {
  const since = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  const { data } = await db
    .from("articles")
    .select("id, cluster_id, title, title_normalized, published_at, outlet_name_raw")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(500);

  return (data ?? []) as ClusterCandidate[];
}
