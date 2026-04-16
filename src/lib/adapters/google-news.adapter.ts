import Parser from "rss-parser";
import type { SourceAdapter, AdapterConfig, FetchResult, RawItem, ValidationResult } from "./types";
import { AdapterError } from "./types";

const parser = new Parser({
  timeout: 15_000,
  headers: { "User-Agent": "MediaMonitor/1.0" },
});

/**
 * Builds a Google News RSS URL from a search query string.
 *
 * Supports two modes:
 *  - settings.query   → /search?q=<encoded>
 *  - settings.feedUrl → use directly (for topic/geo feeds)
 */
function buildGoogleNewsUrl(config: AdapterConfig): string {
  if (config.settings.feedUrl && typeof config.settings.feedUrl === "string") {
    return config.settings.feedUrl;
  }

  const query = config.settings.query as string | undefined;
  if (!query) {
    throw new AdapterError(
      "Google News adapter requires settings.query or settings.feedUrl",
      "google_news"
    );
  }

  const lang = (config.settings.language as string | undefined) ?? "en";
  const country = (config.settings.country as string | undefined) ?? "US";
  const hl = `${lang}-${country}`;
  const gl = country;
  const ceid = `${country}:${lang}`;

  const encoded = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${encoded}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

/**
 * Google News wraps article URLs in a redirect — extract the real URL from the
 * item link or guid when possible.
 */
function extractRealUrl(entry: Parser.Item): string {
  const raw =
    (entry.link as string | undefined) ??
    (entry.guid as string | undefined) ??
    "";

  // Google News redirect URLs look like:
  // https://news.google.com/rss/articles/CBMi...?oc=5
  // The actual article URL is NOT embedded in the redirect; clients must follow
  // the redirect. We return the Google URL and let the pipeline resolve it.
  return raw;
}

export class GoogleNewsAdapter implements SourceAdapter {
  readonly type = "google_news" as const;
  readonly displayName = "Google News";

  async fetch(config: AdapterConfig, cursor?: string): Promise<FetchResult> {
    const startedAt = Date.now();

    let feedUrl: string;
    try {
      feedUrl = buildGoogleNewsUrl(config);
    } catch (err) {
      throw err as AdapterError;
    }

    let feed: Parser.Output<Record<string, unknown>>;
    try {
      feed = await parser.parseURL(feedUrl);
    } catch (err) {
      throw new AdapterError(
        `Failed to fetch Google News feed: ${(err as Error).message}`,
        this.type,
        err
      );
    }

    const sinceDate = cursor ? new Date(cursor) : null;
    const items: RawItem[] = [];
    const errors: FetchResult["errors"] = [];

    for (const entry of feed.items ?? []) {
      try {
        const url = extractRealUrl(entry);
        if (!url) continue;

        const publishedAt =
          (entry.pubDate as string | undefined) ??
          (entry.isoDate as string | undefined) ??
          null;

        if (sinceDate && publishedAt) {
          const pubDate = new Date(publishedAt);
          if (pubDate <= sinceDate) continue;
        }

        const externalId =
          (entry.guid as string | undefined) ?? url;

        // Google News titles often include " - Outlet Name" suffix
        const rawTitle = ((entry.title as string | undefined) ?? "").trim();
        const outletSuffix = rawTitle.lastIndexOf(" - ");
        const title =
          outletSuffix > 0 ? rawTitle.slice(0, outletSuffix).trim() : rawTitle;
        const outletName =
          outletSuffix > 0
            ? rawTitle.slice(outletSuffix + 3).trim()
            : null;

        items.push({
          externalId,
          url,
          title,
          author: null,
          outletName,
          publishedAt,
          bodyText:
            (entry.contentSnippet as string | undefined) ?? null,
          bodyHtml: (entry.content as string | undefined) ?? null,
          language:
            (config.settings.language as string | undefined) ?? "en",
          region: (config.settings.region as string | undefined) ?? null,
          mediaType: "article",
          metadata: {
            feedUrl,
            query: config.settings.query,
            googleNewsUrl: url,
          },
        });
      } catch (err) {
        errors.push({
          url: entry.link as string | undefined,
          message: (err as Error).message,
        });
      }
    }

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
    const errs: string[] = [];
    const hasQuery =
      typeof config.settings.query === "string" &&
      (config.settings.query as string).length > 0;
    const hasFeedUrl =
      typeof config.settings.feedUrl === "string" &&
      (config.settings.feedUrl as string).length > 0;

    if (!hasQuery && !hasFeedUrl) {
      errs.push(
        "Google News adapter requires either settings.query or settings.feedUrl"
      );
    }

    if (hasFeedUrl) {
      try {
        new URL(config.settings.feedUrl as string);
      } catch {
        errs.push("settings.feedUrl must be a valid URL");
      }
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }

  async testConnection(config: AdapterConfig): Promise<boolean> {
    const feedUrl = buildGoogleNewsUrl(config);
    const feed = await parser.parseURL(feedUrl);
    return Array.isArray(feed.items);
  }
}
