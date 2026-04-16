import type { SourceAdapter } from "./types";
import type { SourceType } from "../supabase/types";

import { RssAdapter } from "./rss.adapter";
import { GoogleNewsAdapter } from "./google-news.adapter";
import { ManualUrlAdapter } from "./manual-url.adapter";
import { CsvJsonAdapter } from "./csv-json.adapter";
import { TwitterManualAdapter } from "./twitter-manual.adapter";
import { FileUploadAdapter } from "./file-upload.adapter";
import { MeltwaterAdapter } from "./stubs/meltwater.adapter";
import { FactivaAdapter } from "./stubs/factiva.adapter";
import { TalkwalkerAdapter } from "./stubs/talkwalker.adapter";
import { TVEyesAdapter } from "./stubs/tveyes.adapter";

// ─── Registry ────────────────────────────────────────────────────────────────

const registry = new Map<SourceType, SourceAdapter>();

/**
 * Register an adapter instance by its type identifier.
 * Overwrites any previously registered adapter for the same type.
 */
export function registerAdapter(adapter: SourceAdapter): void {
  registry.set(adapter.type, adapter);
}

/**
 * Retrieve a registered adapter by source type.
 * Returns undefined if no adapter is registered for that type.
 */
export function getAdapter(type: SourceType): SourceAdapter | undefined {
  return registry.get(type);
}

/**
 * List all registered adapters.
 */
export function listAdapters(): SourceAdapter[] {
  return Array.from(registry.values());
}

/**
 * List all registered adapter types.
 */
export function listAdapterTypes(): SourceType[] {
  return Array.from(registry.keys());
}

// ─── Auto-register all adapters ──────────────────────────────────────────────

// Core adapters
registerAdapter(new RssAdapter());
registerAdapter(new GoogleNewsAdapter());
registerAdapter(new ManualUrlAdapter());

// The csv_import type covers both CSV and JSON imports
const csvJsonAdapter = new CsvJsonAdapter();
registerAdapter(csvJsonAdapter);
// Also register the same adapter instance for json_import
// (type assertion needed since CsvJsonAdapter.type is "csv_import")
registry.set("json_import", csvJsonAdapter);

registerAdapter(new TwitterManualAdapter());
registerAdapter(new FileUploadAdapter());

// Licensed / stub adapters
registerAdapter(new MeltwaterAdapter());
registerAdapter(new FactivaAdapter());
registerAdapter(new TalkwalkerAdapter());
registerAdapter(new TVEyesAdapter());
