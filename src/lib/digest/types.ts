import type { ArticleRow, SectionRow, SubsectionRow } from "../supabase/types";

// ─── Digest configuration ─────────────────────────────────────────────────────

export interface DigestConfig {
  /** Date for which to build the digest (Date object or ISO YYYY-MM-DD string) */
  date: Date | string;
  /** Ordered list of section IDs to include in the digest */
  sectionOrder?: string[];
  /** Article statuses to include (default: ["classified", "reviewed", "published"]) */
  includeStatuses?: Array<"classified" | "reviewed" | "published" | "pending">;
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
  /** Full article row (only present when built from DB) */
  article?: ArticleRow;
  /** Article ID (always present) */
  articleId?: string;
  /** Final display headline (may differ from article.title) */
  headline: string;
  /** Short text snippet */
  snippet?: string | null;
  /** Outlet display name */
  outletName: string;
  /** ISO 8601 publish timestamp or Date */
  publishedAt: string | Date | null;
  /** Public article URL */
  url: string;
  /** Names of entities mentioned in this article */
  entityMentions: string[];
}

// ─── Digest subsection ────────────────────────────────────────────────────────

export interface DigestSubsection {
  subsection: SubsectionRow | null;
  items: DigestItem[];
}

// ─── Digest section ───────────────────────────────────────────────────────────

export interface DigestSection {
  section: SectionRow;
  /** Articles directly in this section (no subsection) */
  items?: DigestItem[];
  /** Grouped subsections */
  subsections: DigestSubsection[];
  /** True if the section has any items (including in subsections) */
  hasItems: boolean;
}

// ─── Subsection input for buildDigestFromArticles ────────────────────────────

export interface SubsectionInput {
  id: string;
  section_id: string;
  name: string;
  slug: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Full digest data ─────────────────────────────────────────────────────────

export interface DigestData {
  /** Date for this digest */
  date: Date | string;
  /** Overview / executive summary text (optional) */
  overview?: string | null;
  sections: DigestSection[];
  /** ISO 8601 coverage window start */
  coverageStart?: string;
  /** ISO 8601 coverage window end */
  coverageEnd?: string;
  /** Total article count across all sections */
  totalItems?: number;
}
