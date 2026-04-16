import type { SourceAdapter, AdapterConfig, FetchResult, ValidationResult } from "../types";
import { AdapterNotLicensedError } from "../types";

/**
 * Dow Jones Factiva stub adapter.
 *
 * Factiva is a licensed news archive and monitoring service. This stub
 * implements the SourceAdapter interface so it can be registered and selected
 * in the UI, but all fetch attempts throw AdapterNotLicensedError until a
 * commercial integration is configured.
 *
 * Config schema (for UI display):
 *   credentials.username  — Factiva account username / user key
 *   credentials.password  — Factiva account password / encryption key
 *   settings.accountId    — Dow Jones account ID / namespace
 *   settings.query        — FQL (Factiva Query Language) search string
 *   settings.endpoint     — API base URL (default: https://api.dowjones.com)
 *   settings.sources      — Comma-separated list of Factiva source codes
 *   settings.language     — Filter by language code (e.g. en)
 *   settings.dateRange    — "last_24h" | "last_week" | custom ISO range
 *   settings.pageSize     — Items per page (default: 25, max: 100)
 */
export const configSchema = {
  credentials: {
    username: {
      type: "string",
      label: "Username",
      description: "Factiva / Dow Jones account username or user key",
      secret: false,
      required: true,
    },
    password: {
      type: "string",
      label: "Password / Encryption Key",
      description: "Factiva account password or encryption key",
      secret: true,
      required: true,
    },
  },
  settings: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Dow Jones account ID / namespace",
      required: true,
    },
    query: {
      type: "string",
      label: "FQL Query",
      description: "Factiva Query Language (FQL) search string",
      required: true,
    },
    endpoint: {
      type: "string",
      label: "API Endpoint",
      description: "Factiva API base URL",
      default: "https://api.dowjones.com",
      required: false,
    },
    sources: {
      type: "string",
      label: "Source Codes",
      description: "Comma-separated list of Factiva source codes (e.g. NYT,WSJ)",
      required: false,
    },
    language: {
      type: "string",
      label: "Language Filter",
      description: "Filter results by language code",
      required: false,
    },
    dateRange: {
      type: "string",
      label: "Date Range",
      description: 'Coverage window: "last_24h", "last_week", or ISO date range',
      default: "last_24h",
      required: false,
    },
    pageSize: {
      type: "number",
      label: "Page Size",
      description: "Number of articles to fetch per request (max 100)",
      default: 25,
      required: false,
    },
  },
} as const;

export class FactivaAdapter implements SourceAdapter {
  readonly type = "factiva" as const;
  readonly displayName = "Dow Jones Factiva (Licensed)";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(_config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    throw new AdapterNotLicensedError(this.type);
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];

    if (!config.credentials?.username) {
      errs.push("credentials.username is required");
    }
    if (!config.credentials?.password) {
      errs.push("credentials.password is required");
    }
    if (!config.settings.accountId) {
      errs.push("settings.accountId is required");
    }
    if (!config.settings.query) {
      errs.push("settings.query (FQL query string) is required");
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }

  async testConnection(_config: AdapterConfig): Promise<boolean> {
    throw new AdapterNotLicensedError(this.type);
  }
}
