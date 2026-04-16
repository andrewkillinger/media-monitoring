import type { SourceAdapter, AdapterConfig, FetchResult, ValidationResult } from "../types";
import { AdapterNotLicensedError } from "../types";

/**
 * TVEyes stub adapter.
 *
 * TVEyes is a licensed broadcast media monitoring platform that captures TV
 * and radio content. This stub implements the SourceAdapter interface but all
 * fetch attempts throw AdapterNotLicensedError until a commercial integration
 * is configured.
 *
 * Config schema (for UI display):
 *   credentials.apiKey    — TVEyes API key
 *   credentials.username  — TVEyes account username
 *   credentials.password  — TVEyes account password
 *   settings.query        — Search query string (keywords / phrases)
 *   settings.endpoint     — API base URL (default: https://api.tveyes.com)
 *   settings.markets      — Comma-separated DMA market codes or "all"
 *   settings.mediaTypes   — tv | radio | both (default: both)
 *   settings.language     — Language filter
 *   settings.country      — Country filter (e.g. US, CA, GB)
 *   settings.pageSize     — Items per request (default: 25, max: 100)
 *   settings.includeClips — Whether to include clip/thumbnail URLs (bool)
 */
export const configSchema = {
  credentials: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "TVEyes API key from your account settings",
      secret: true,
      required: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "TVEyes account username",
      secret: false,
      required: false,
    },
    password: {
      type: "string",
      label: "Password",
      description: "TVEyes account password",
      secret: true,
      required: false,
    },
  },
  settings: {
    query: {
      type: "string",
      label: "Search Query",
      description: "Keywords or phrases to monitor in broadcast transcripts",
      required: true,
    },
    endpoint: {
      type: "string",
      label: "API Endpoint",
      description: "TVEyes API base URL",
      default: "https://api.tveyes.com",
      required: false,
    },
    markets: {
      type: "string",
      label: "DMA Markets",
      description:
        'Comma-separated DMA market codes to monitor, or "all" for all markets',
      default: "all",
      required: false,
    },
    mediaTypes: {
      type: "string",
      label: "Media Types",
      description: "Types of broadcast media to monitor: tv, radio, or both",
      default: "both",
      required: false,
    },
    language: {
      type: "string",
      label: "Language Filter",
      description: "Language code filter for transcripts",
      required: false,
    },
    country: {
      type: "string",
      label: "Country Filter",
      description: "Country code filter (e.g. US, CA, GB)",
      required: false,
    },
    pageSize: {
      type: "number",
      label: "Page Size",
      description: "Number of items to fetch per request (max 100)",
      default: 25,
      required: false,
    },
    includeClips: {
      type: "boolean",
      label: "Include Clip URLs",
      description: "Include links to video/audio clip thumbnails and downloads",
      default: false,
      required: false,
    },
  },
} as const;

export class TVEyesAdapter implements SourceAdapter {
  readonly type = "tveyes" as const;
  readonly displayName = "TVEyes (Licensed)";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(_config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    throw new AdapterNotLicensedError(this.type);
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];

    if (!config.credentials?.apiKey) {
      errs.push("credentials.apiKey is required");
    }
    if (!config.settings.query) {
      errs.push("settings.query (search keywords) is required");
    }
    if (
      config.settings.mediaTypes &&
      !["tv", "radio", "both"].includes(config.settings.mediaTypes as string)
    ) {
      errs.push('settings.mediaTypes must be "tv", "radio", or "both"');
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }

  async testConnection(_config: AdapterConfig): Promise<boolean> {
    throw new AdapterNotLicensedError(this.type);
  }
}
