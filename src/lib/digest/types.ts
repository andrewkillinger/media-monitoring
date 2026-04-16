import type { ArticleRow, SectionRow, SubsectionRow } from "../supabase/types";

// ─── Digest configuration ─────────────────────────────────────────────────────

export interface DigestConfig {
  /** ISO date string (YYYY-MM-DD) for which digest to build */
  date: string;
  /** Ordered list of section IDs to include in the digest */
  sectionOrder?: string[];
  /** Article statuses to include (default: ["classified", "reviewed", "published"]) */
  includeStatuses?: string[];
  /** Maximum articles per section (0 = unlimited) */
  maxItemsPerSection?: number;
  /** Whether to include sections with no articles (default: true) */
  includeEmptySections?: boolean;
  /** Coverage window start (ISO 8601) — overrides date-based defaults */
  coverageStart?: string;
  /** Coverage window end (ISO 8601) — overrides date-based defaults */
  coverageEnd?: string;
}

// ─── Digest item (one article row in the digest) ──────────────────────────────

export interface DigestItem {
  article: ArticleRow;
  /** Final display headline (may differ from article.title) */
  headline: string;
  /** Short text snippet */
  snippet: string | null;
  /** Outlet display name */
  outletName: string;
  /** ISO 8601 publish timestamp */
  publishedAt: string | null;
  /** Public article URL */
  url: string;
  /** Names of entities mentioned in this article */
  entityMentions: string[];
}

// ─── Digest subsection ────────────────────────────────────────────────────────

export interface DigestSubsection {
  subsection: SubsectionRow;
  items: DigestItem[];
}

// ─── Digest section ───────────────────────────────────────────────────────────

export interface DigestSection {
  section: SectionRow;
  /** Articles directly in this section (no subsection) */
  items: DigestItem[];
  /** Grouped subsections */
  subsections: DigestSubsection[];
  /** True if the section has any items (including in subsections) */
  hasItems: boolean;
}

// ─── Full digest data ─────────────────────────────────────────────────────────

export interface DigestData {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Overview / executive summary text (optional) */
  overview: string | null;
  sections: DigestSection[];
  /** ISO 8601 coverage window start */
  coverageStart: string;
  /** ISO 8601 coverage window end */
  coverageEnd: string;
  /** Total article count across all sections */
  totalItems: number;
}
