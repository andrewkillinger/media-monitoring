import Parser from "rss-parser";
import type { SourceAdapter, AdapterConfig, FetchResult, RawItem, ValidationResult } from "./types";
import { AdapterError } from "./types";

const parser = new Parser({
  timeout: 15_000,
  headers: { "User-Agent": "MediaMonitor/1.0" },
});

export class RssAdapter implements SourceAdapter {
  readonly type = "rss" as const;
  readonly displayName = "RSS Feed";

  async fetch(config: AdapterConfig, cursor?: string): Promise<FetchResult> {
    const startedAt = Date.now();
    const feedUrl = config.settings.feedUrl as string | undefined;

    if (!feedUrl) {
      throw new AdapterError(
        "RSS adapter requires settings.feedUrl",
        this.type
      );
    }

    let feed: Parser.Output<Record<string, unknown>>;
    try {
      feed = await parser.parseURL(feedUrl);
    } catch (err) {
      throw new AdapterError(
        `Failed to fetch RSS feed from ${feedUrl}: ${(err as Error).message}`,
        this.type,
        err
      );
    }

    const sinceDate = cursor ? new Date(cursor) : null;
    const items: RawItem[] = [];
    const errors: FetchResult["errors"] = [];

    for (const entry of feed.items ?? []) {
      try {
        const url = (entry.link ?? entry.guid ?? "") as string;
        if (!url) continue;

        const publishedAt =
          (entry.pubDate as string | undefined) ??
          (entry.isoDate as string | undefined) ??
          null;

        // Skip items older than the cursor
        if (sinceDate && publishedAt) {
          const pubDate = new Date(publishedAt);
          if (pubDate <= sinceDate) continue;
        }

        const externalId =
          (entry.guid as string | undefined) ??
          (entry.link as string | undefined) ??
          url;

        items.push({
          externalId,
          url,
          title: ((entry.title as string | undefined) ?? "").trim(),
          author:
            (entry.creator as string | undefined) ??
            (entry.author as string | undefined) ??
            null,
          outletName:
            (entry["dc:creator"] as string | undefined) ??
            feed.title ??
            null,
          publishedAt,
          bodyText: entry.contentSnippet as string | undefined ?? null,
          bodyHtml: entry.content as string | undefined ?? null,
          language: (config.settings.language as string | undefined) ?? "en",
          region: (config.settings.region as string | undefined) ?? null,
          mediaType: "article",
          metadata: {
            feedTitle: feed.title,
            feedUrl,
            categories: entry.categories,
          },
        });
      } catch (err) {
        errors.push({
          url: entry.link as string | undefined,
          message: (err as Error).message,
        });
      }
    }

    // New cursor = ISO string of the most recent item's publish date
    const latestDate = items
      .map((i) => (i.publishedAt ? new Date(i.publishedAt).getTime() : 0))
      .reduce((a, b) => Math.max(a, b), 0);

    const newCursor =
      latestDate > 0 ? new Date(latestDate).toISOString() : cursor ?? null;

    return {
      items,
      cursor: newCursor,
      errors: errors.length > 0 ? errors : undefined,
      metadata: {
        fetchedAt: new Date(startedAt).toISOString(),
        durationMs: Date.now() - startedAt,
      },
    };
  }

  validate(config: AdapterConfig): ValidationResult {
    const errors: string[] = [];
    const feedUrl = config.settings.feedUrl;

    if (!feedUrl || typeof feedUrl !== "string") {
      errors.push("settings.feedUrl is required");
    } else {
      try {
        new URL(feedUrl);
      } catch {
        errors.push("settings.feedUrl must be a valid URL");
      }
    }

    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  }

  async testConnection(config: AdapterConfig): Promise<boolean> {
    const feedUrl = config.settings.feedUrl as string;
    const feed = await parser.parseURL(feedUrl);
    return Array.isArray(feed.items);
  }
}
