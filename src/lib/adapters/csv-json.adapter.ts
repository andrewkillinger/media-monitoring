import { parse as parseCsv } from "csv-parse/sync";
import type { SourceAdapter, AdapterConfig, FetchResult, RawItem, ValidationResult } from "./types";
import { AdapterError } from "./types";

// Expected column/field names — case-insensitive
const FIELD_MAP: Record<string, keyof RawItemInput> = {
  url: "url",
  title: "title",
  outlet: "outletName",
  outlet_name: "outletName",
  outletname: "outletName",
  published_at: "publishedAt",
  publishedat: "publishedAt",
  date: "publishedAt",
  pub_date: "publishedAt",
  author: "author",
  body: "bodyText",
  body_snippet: "bodyText",
  bodysnippet: "bodyText",
  body_text: "bodyText",
  bodytext: "bodyText",
  content: "bodyText",
  language: "language",
  lang: "language",
  region: "region",
  media_type: "mediaType",
  mediatype: "mediaType",
  type: "mediaType",
  external_id: "externalId",
  externalid: "externalId",
  id: "externalId",
};

interface RawItemInput {
  url?: string;
  title?: string;
  outletName?: string;
  publishedAt?: string;
  author?: string;
  bodyText?: string;
  language?: string;
  region?: string;
  mediaType?: string;
  externalId?: string;
}

function normalizeKeys(record: Record<string, unknown>): RawItemInput {
  const out: RawItemInput = {};
  for (const [key, value] of Object.entries(record)) {
    const normalized = key.toLowerCase().replace(/\s+/g, "_");
    const mapped = FIELD_MAP[normalized];
    if (mapped && value != null && value !== "") {
      (out as Record<string, unknown>)[mapped] = String(value).trim();
    }
  }
  return out;
}

function recordToRawItem(
  record: Record<string, unknown>,
  index: number,
  defaults: AdapterConfig["settings"]
): RawItem {
  const input = normalizeKeys(record);

  if (!input.url) {
    throw new Error(`Row ${index + 1}: missing required field "url"`);
  }

  const url = input.url;
  const externalId = input.externalId ?? url;
  const title = input.title ?? url;

  return {
    externalId,
    url,
    title,
    author: input.author ?? null,
    outletName: input.outletName ?? (defaults.outletName as string | undefined) ?? null,
    publishedAt: input.publishedAt ?? null,
    bodyText: input.bodyText ?? null,
    bodyHtml: null,
    language: input.language ?? (defaults.language as string | undefined) ?? "en",
    region: input.region ?? (defaults.region as string | undefined) ?? null,
    mediaType: input.mediaType ?? "article",
    metadata: {
      importSource: "csv_json",
      rowIndex: index,
    },
  };
}

export class CsvJsonAdapter implements SourceAdapter {
  readonly type = "csv_import" as const;
  readonly displayName = "CSV/JSON Import";

  async fetch(config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    const startedAt = Date.now();

    // Support both settings.content (original) and settings.data (test convention)
    const rawContent = (config.settings.content ?? config.settings.data) as string | undefined;
    const format = (config.settings.format as string | undefined) ?? "csv";

    if (!rawContent) {
      throw new AdapterError(
        "CSV/JSON adapter requires settings.content (file contents as string)",
        this.type
      );
    }

    let records: Record<string, unknown>[];

    try {
      if (format === "json") {
        const parsed = JSON.parse(rawContent);
        if (!Array.isArray(parsed)) {
          throw new Error("JSON content must be an array of objects");
        }
        records = parsed as Record<string, unknown>[];
      } else {
        // CSV
        records = parseCsv(rawContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true,
        }) as Record<string, unknown>[];
      }
    } catch (err) {
      throw new AdapterError(
        `Failed to parse ${format.toUpperCase()} content: ${(err as Error).message}`,
        this.type,
        err
      );
    }

    const items: RawItem[] = [];
    const errors: FetchResult["errors"] = [];

    for (let i = 0; i < records.length; i++) {
      try {
        const item = recordToRawItem(records[i], i, config.settings);
        items.push(item);
      } catch (err) {
        errors.push({
          message: (err as Error).message,
        });
      }
    }

    return {
      items,
      cursor: null,
      errors: errors.length > 0 ? errors : undefined,
      metadata: {
        fetchedAt: new Date(startedAt).toISOString(),
        durationMs: Date.now() - startedAt,
      },
    };
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];
    const content = config.settings.content ?? config.settings.data;
    const format = config.settings.format;

    if (!content || typeof content !== "string") {
      errs.push("settings.content (or settings.data) is required");
    }

    if (format !== undefined && !["csv", "json"].includes(format as string)) {
      errs.push('settings.format must be "csv" or "json"');
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }
}
