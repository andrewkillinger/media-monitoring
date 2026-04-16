import type { SourceAdapter, AdapterConfig, FetchResult, RawItem, ValidationResult } from "./types";
import { AdapterError } from "./types";

/**
 * Extracts the text content of a specific HTML tag (first occurrence).
 */
function extractTagContent(html: string, tag: string): string | null {
  const pattern = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = pattern.exec(html);
  return match ? match[1].trim() : null;
}

/**
 * Strips HTML tags to produce plain text.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Extracts the canonical URL from <link rel="canonical"> if present.
 */
function extractCanonicalUrl(html: string, fallback: string): string {
  const match = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i.exec(html);
  return match ? match[1] : fallback;
}

/**
 * Extracts an Open Graph or Twitter meta tag content.
 */
function extractMetaContent(html: string, property: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const match = pattern.exec(html);
  if (match) return match[1].trim();

  // Also try content-first attribute ordering
  const altPattern = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i"
  );
  const altMatch = altPattern.exec(html);
  return altMatch ? altMatch[1].trim() : null;
}

export class ManualUrlAdapter implements SourceAdapter {
  readonly type = "manual_url" as const;
  readonly displayName = "Manual URL Import";

  async fetch(config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    const startedAt = Date.now();
    const url = config.settings.url as string | undefined;

    if (!url) {
      throw new AdapterError(
        "Manual URL adapter requires settings.url",
        this.type
      );
    }

    let html: string;
    let finalUrl = url;

    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MediaMonitor/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(15_000),
      });

      finalUrl = res.url || url;

      if (!res.ok) {
        throw new AdapterError(
          `HTTP ${res.status} ${res.statusText} fetching ${url}`,
          this.type
        );
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        throw new AdapterError(
          `URL returned non-HTML content type: ${contentType}`,
          this.type
        );
      }

      html = await res.text();
    } catch (err) {
      if (err instanceof AdapterError) throw err;
      throw new AdapterError(
        `Failed to fetch URL ${url}: ${(err as Error).message}`,
        this.type,
        err
      );
    }

    const canonicalUrl = extractCanonicalUrl(html, finalUrl);

    // Try OG title, then <title> tag
    const title =
      extractMetaContent(html, "og:title") ??
      extractTagContent(html, "title") ??
      url;

    const description =
      extractMetaContent(html, "og:description") ??
      extractMetaContent(html, "description") ??
      null;

    const author =
      extractMetaContent(html, "author") ??
      extractMetaContent(html, "article:author") ??
      null;

    const publishedAt =
      extractMetaContent(html, "article:published_time") ??
      extractMetaContent(html, "pubdate") ??
      null;

    const outletName =
      extractMetaContent(html, "og:site_name") ??
      (config.settings.outletName as string | undefined) ??
      null;

    const bodyText = description
      ? htmlToText(html).slice(0, 5000)
      : htmlToText(html).slice(0, 5000);

    const item: RawItem = {
      externalId: canonicalUrl,
      url: canonicalUrl,
      title: title.trim(),
      author,
      outletName,
      publishedAt,
      bodyText,
      bodyHtml: null, // We don't store full HTML for manual imports
      language: (config.settings.language as string | undefined) ?? "en",
      region: (config.settings.region as string | undefined) ?? null,
      mediaType: "article",
      metadata: {
        sourceUrl: url,
        canonicalUrl,
        description,
        manualImport: true,
      },
    };

    return {
      items: [item],
      cursor: null,
      metadata: {
        fetchedAt: new Date(startedAt).toISOString(),
        durationMs: Date.now() - startedAt,
      },
    };
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];
    const url = config.settings.url;

    if (!url || typeof url !== "string") {
      errs.push("settings.url is required");
    } else {
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          errs.push("settings.url must use http or https");
        }
      } catch {
        errs.push("settings.url must be a valid URL");
      }
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }
}
