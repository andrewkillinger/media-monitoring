import type { SourceAdapter, AdapterConfig, FetchResult, RawItem, ValidationResult } from "./types";
import { AdapterError } from "./types";

export interface TwitterPostInput {
  url: string;
  authorHandle: string;
  displayName?: string | null;
  followerCount?: number | null;
  text: string;
  publishedAt?: string | null;
  engagementMetrics?: {
    likes?: number;
    retweets?: number;
    replies?: number;
    views?: number;
    bookmarks?: number;
  } | null;
  language?: string | null;
  region?: string | null;
}

function buildExternalId(url: string, handle: string): string {
  // Extract tweet ID from URL if possible
  const match = /\/status\/(\d+)/.exec(url);
  if (match) return `twitter:${match[1]}`;
  return `twitter:${handle}:${Date.now()}`;
}

function buildTitle(input: TwitterPostInput): string {
  const displayName = input.displayName ?? `@${input.authorHandle}`;
  const snippet =
    input.text.length > 80 ? input.text.slice(0, 80) + "…" : input.text;
  return `${displayName}: ${snippet}`;
}

export class TwitterManualAdapter implements SourceAdapter {
  readonly type = "twitter_manual" as const;
  readonly displayName = "Manual X/Twitter Entry";

  async fetch(config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    const startedAt = Date.now();

    // Validate required fields
    const validation = this.validate(config);
    if (!validation.valid && validation.errors && validation.errors.length > 0) {
      throw new AdapterError(validation.errors.join("; "), this.type);
    }

    const input: TwitterPostInput = {
      url: config.settings.url as string,
      authorHandle: config.settings.authorHandle as string,
      displayName: (config.settings.displayName as string | undefined) ?? null,
      followerCount:
        (config.settings.followerCount as number | undefined) ?? null,
      text: config.settings.text as string,
      publishedAt:
        (config.settings.publishedAt as string | undefined) ?? null,
      engagementMetrics:
        (config.settings.engagementMetrics as TwitterPostInput["engagementMetrics"]) ??
        null,
      language: (config.settings.language as string | undefined) ?? "en",
      region: (config.settings.region as string | undefined) ?? null,
    };

    const item: RawItem = {
      externalId: buildExternalId(input.url, input.authorHandle),
      url: input.url,
      title: buildTitle(input),
      author: input.displayName
        ? `${input.displayName} (@${input.authorHandle})`
        : `@${input.authorHandle}`,
      outletName: "X (Twitter)",
      publishedAt: input.publishedAt ?? new Date().toISOString(),
      bodyText: input.text,
      bodyHtml: null,
      language: input.language ?? "en",
      region: input.region,
      mediaType: "tweet",
      metadata: {
        platform: "twitter",
        authorHandle: input.authorHandle,
        displayName: input.displayName,
        followerCount: input.followerCount,
        engagementMetrics: input.engagementMetrics,
        manualEntry: true,
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

    if (!config.settings.url || typeof config.settings.url !== "string") {
      errs.push("settings.url is required");
    } else {
      try {
        new URL(config.settings.url as string);
      } catch {
        errs.push("settings.url must be a valid URL");
      }
    }

    if (
      !config.settings.authorHandle ||
      typeof config.settings.authorHandle !== "string"
    ) {
      errs.push("settings.authorHandle is required");
    }

    if (!config.settings.text || typeof config.settings.text !== "string") {
      errs.push("settings.text (tweet content) is required");
    }

    if (
      config.settings.followerCount !== undefined &&
      config.settings.followerCount !== null &&
      typeof config.settings.followerCount !== "number"
    ) {
      errs.push("settings.followerCount must be a number");
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }
}
