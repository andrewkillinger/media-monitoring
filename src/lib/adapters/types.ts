import type { SourceType } from "../supabase/types";

// ─── Raw item from any source adapter ────────────────────────────────────────

export interface RawItem {
  /** Source-specific unique identifier */
  externalId: string;
  /** Canonical article URL */
  url: string;
  /** Article title */
  title: string;
  /** Author name or handle */
  author?: string | null;
  /** Outlet / publication name as reported by the source */
  outletName?: string | null;
  /** ISO 8601 publish timestamp */
  publishedAt?: string | null;
  /** Plain-text body content */
  bodyText?: string | null;
  /** Raw HTML body content */
  bodyHtml?: string | null;
  /** BCP-47 language code, e.g. "en" */
  language?: string | null;
  /** Geographic region string, e.g. "US", "Canada" */
  region?: string | null;
  /** Media type string, e.g. "article", "press_release", "tweet" */
  mediaType?: string | null;
  /** Adapter-specific extra data */
  metadata?: Record<string, unknown>;
}

// ─── Fetch result returned by an adapter ─────────────────────────────────────

export interface FetchResult {
  /** Items retrieved during this fetch */
  items: RawItem[];
  /** Opaque pagination cursor to pass on the next fetch */
  cursor?: string | null;
  /** Non-fatal per-item errors encountered */
  errors?: Array<{ externalId?: string; url?: string; message: string }>;
  metadata: {
    /** ISO 8601 timestamp when the fetch started */
    fetchedAt: string;
    /** Wall-clock duration in milliseconds */
    durationMs: number;
  };
}

// ─── Adapter configuration stored in source_adapters table ───────────────────

export interface AdapterConfig {
  id: string;
  type: SourceType;
  name: string;
  /** Adapter-specific settings (URLs, queries, filters, etc.) */
  settings: Record<string, unknown>;
  /** Decrypted credentials — only available server-side */
  credentials?: Record<string, unknown> | null;
  /** Last pagination cursor returned by the adapter */
  lastCursor?: string | null;
  isActive: boolean;
}

// ─── Validation result ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

// ─── Source adapter interface ─────────────────────────────────────────────────

export interface SourceAdapter {
  /** Stable type identifier matching the source_type enum */
  readonly type: SourceType;

  /** Human-readable display name for the adapter */
  readonly displayName: string;

  /**
   * Fetch new items since the last cursor.
   * @param config   Runtime adapter configuration
   * @param cursor   Resume from this cursor; undefined means fetch from start
   */
  fetch(config: AdapterConfig, cursor?: string): Promise<FetchResult>;

  /**
   * Validate adapter settings. Returns a ValidationResult with valid flag
   * and optional array of human-readable error messages.
   */
  validate(config: AdapterConfig): ValidationResult | Promise<ValidationResult>;

  /**
   * Optional: perform a live connectivity check.
   * Returns true on success, throws or returns false on failure.
   */
  testConnection?(config: AdapterConfig): Promise<boolean>;
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export class AdapterError extends Error {
  constructor(
    message: string,
    public readonly adapterType: SourceType,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AdapterError";
  }
}

export class AdapterNotLicensedError extends AdapterError {
  constructor(adapterType: SourceType) {
    super(
      `The "${adapterType}" adapter requires a commercial license that is not configured. ` +
        `Contact your account manager to enable this integration.`,
      adapterType
    );
    this.name = "AdapterNotLicensedError";
  }
}
