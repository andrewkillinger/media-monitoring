import type { SourceAdapter, AdapterConfig, FetchResult, ValidationResult } from "../types";
import { AdapterNotLicensedError } from "../types";

/**
 * Talkwalker stub adapter.
 *
 * Talkwalker is a licensed social listening and media analytics platform.
 * This stub implements the SourceAdapter interface but all fetch attempts
 * throw AdapterNotLicensedError until a commercial integration is configured.
 *
 * Config schema (for UI display):
 *   credentials.apiToken   — Talkwalker API access token
 *   settings.projectId     — Talkwalker project ID
 *   settings.topicId       — Saved search / topic ID within the project
 *   settings.endpoint      — API base URL (default: https://api.talkwalker.com)
 *   settings.sources       — Array of source types: news, blogs, social, etc.
 *   settings.language      — Language filter (BCP-47 code)
 *   settings.region        — Geographic region filter
 *   settings.sentiment     — Sentiment filter: positive | negative | neutral
 *   settings.pageSize      — Items per page (default: 50, max: 200)
 */
export const configSchema = {
  credentials: {
    apiToken: {
      type: "string",
      label: "API Token",
      description: "Talkwalker API access token from your account settings",
      secret: true,
      required: true,
    },
  },
  settings: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Talkwalker project identifier",
      required: true,
    },
    topicId: {
      type: "string",
      label: "Topic / Search ID",
      description: "Saved search or topic ID within the project",
      required: true,
    },
    endpoint: {
      type: "string",
      label: "API Endpoint",
      description: "Talkwalker API base URL",
      default: "https://api.talkwalker.com",
      required: false,
    },
    sources: {
      type: "array",
      label: "Source Types",
      description: "Source types to include: news, blogs, social, forums, review",
      default: ["news"],
      required: false,
    },
    language: {
      type: "string",
      label: "Language Filter",
      description: "BCP-47 language code to filter results",
      required: false,
    },
    region: {
      type: "string",
      label: "Region Filter",
      description: "Geographic region filter",
      required: false,
    },
    sentiment: {
      type: "string",
      label: "Sentiment Filter",
      description: "Filter by sentiment: positive, negative, neutral",
      required: false,
    },
    pageSize: {
      type: "number",
      label: "Page Size",
      description: "Number of items per request (max 200)",
      default: 50,
      required: false,
    },
  },
} as const;

export class TalkwalkerAdapter implements SourceAdapter {
  readonly type = "talkwalker" as const;
  readonly displayName = "Talkwalker (Licensed)";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(_config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    throw new AdapterNotLicensedError(this.type);
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];

    if (!config.credentials?.apiToken) {
      errs.push("credentials.apiToken is required");
    }
    if (!config.settings.projectId) {
      errs.push("settings.projectId is required");
    }
    if (!config.settings.topicId) {
      errs.push("settings.topicId is required");
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }

  async testConnection(_config: AdapterConfig): Promise<boolean> {
    throw new AdapterNotLicensedError(this.type);
  }
}
