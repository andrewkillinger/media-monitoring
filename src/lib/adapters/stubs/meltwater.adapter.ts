import type { SourceAdapter, AdapterConfig, FetchResult, ValidationResult } from "../types";
import { AdapterNotLicensedError } from "../types";

/**
 * Meltwater stub adapter.
 *
 * Meltwater is a licensed media intelligence platform. This stub implements
 * the SourceAdapter interface so it can be registered and selected in the UI,
 * but all fetch attempts throw AdapterNotLicensedError until a commercial
 * integration is configured.
 *
 * Config schema (for UI display):
 *   credentials.apiKey  — Meltwater API key (Bearer token)
 *   settings.searchId   — Numeric ID of the saved Meltwater search / feed
 *   settings.endpoint   — API base URL (default: https://api.meltwater.com)
 *   settings.pageSize   — Items per page (default: 50, max: 500)
 *   settings.language   — Filter by BCP-47 language code
 *   settings.region     — Filter by region
 */
export const configSchema = {
  credentials: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Meltwater API Bearer token from your account dashboard",
      secret: true,
      required: true,
    },
  },
  settings: {
    searchId: {
      type: "string",
      label: "Search / Feed ID",
      description: "Numeric ID of the saved search or editorial feed in Meltwater",
      required: true,
    },
    endpoint: {
      type: "string",
      label: "API Endpoint",
      description: "Meltwater API base URL",
      default: "https://api.meltwater.com",
      required: false,
    },
    pageSize: {
      type: "number",
      label: "Page Size",
      description: "Number of items to fetch per request (max 500)",
      default: 50,
      required: false,
    },
    language: {
      type: "string",
      label: "Language Filter",
      description: "BCP-47 language code to filter results (e.g. en)",
      required: false,
    },
    region: {
      type: "string",
      label: "Region Filter",
      description: "Geographic region to filter results",
      required: false,
    },
  },
} as const;

export class MeltwaterAdapter implements SourceAdapter {
  readonly type = "meltwater" as const;
  readonly displayName = "Meltwater (Licensed)";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(_config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    throw new AdapterNotLicensedError(this.type);
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];

    if (!config.credentials?.apiKey) {
      errs.push("credentials.apiKey is required");
    }
    if (!config.settings.searchId) {
      errs.push("settings.searchId is required");
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }

  async testConnection(_config: AdapterConfig): Promise<boolean> {
    throw new AdapterNotLicensedError(this.type);
  }
}
