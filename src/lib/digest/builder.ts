import { createAdminClient } from "../supabase/admin";
import type {
  ArticleRow,
  ArticleSectionRow,
  ArticleEntityRow,
  EntityRow,
  SectionRow,
  SubsectionRow,
  ArticleStatus,
} from "../supabase/types";
import type {
  DigestConfig,
  DigestData,
  DigestSection,
  DigestSubsection,
  DigestItem,
  SubsectionInput,
} from "./types";
import { extractSnippet } from "../pipeline/normalize";

// ─── Default configuration ────────────────────────────────────────────────────

const DEFAULT_INCLUDE_STATUSES: ArticleStatus[] = ["classified", "reviewed", "published"];
const DEFAULT_MAX_ITEMS = 0; // unlimited
const DEFAULT_INCLUDE_EMPTY = true;

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Build a full DigestData object from the database for the given config.
 */
export async function buildDigest(config: DigestConfig): Promise<DigestData> {
  const db = createAdminClient();

  const includeStatuses = config.includeStatuses ?? DEFAULT_INCLUDE_STATUSES;
  const maxItems = config.maxItemsPerSection ?? DEFAULT_MAX_ITEMS;
  const includeEmpty = config.includeEmptySections ?? DEFAULT_INCLUDE_EMPTY;

  // Determine coverage window
  const { coverageStart, coverageEnd } = resolveCoverageWindow(config);

  // Load articles within the coverage window
  const { data: articles, error: articlesError } = await db
    .from("articles")
    .select("*")
    .in("status", includeStatuses)
    .gte("published_at", coverageStart)
    .lte("published_at", coverageEnd)
    .order("priority_score", { ascending: false })
    .order("published_at", { ascending: false });

  if (articlesError) {
    throw new Error(`Failed to load articles: ${articlesError.message}`);
  }

  const articleList = (articles ?? []) as ArticleRow[];
  const articleIds = articleList.map((a) => a.id);

  // Load section assignments
  const { data: articleSections } = await db
    .from("article_sections")
    .select("*")
    .in("article_id", articleIds.length > 0 ? articleIds : ["_none_"]);

  // Load entity mentions for these articles
  const { data: articleEntities } = await db
    .from("article_entities")
    .select("article_id, entity_id")
    .in("article_id", articleIds.length > 0 ? articleIds : ["_none_"]);

  // Load entity names
  let entityNames = new Map<string, string>();
  if (articleEntities && Array.isArray(articleEntities) && articleEntities.length > 0) {
    const entityIds = [...new Set((articleEntities as ArticleEntityRow[]).map((e) => e.entity_id))];
    const { data: entities } = await db
      .from("entities")
      .select("id, name")
      .in("id", entityIds);

    entityNames = new Map(
      ((entities ?? []) as Pick<EntityRow, "id" | "name">[]).map((e) => [e.id, e.name])
    );
  }

  // Load all active sections and subsections
  const { data: sections } = await db
    .from("sections")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const { data: subsections } = await db
    .from("subsections")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const allSections = (sections ?? []) as SectionRow[];
  const allSubsections = (subsections ?? []) as SubsectionRow[];

  // Build lookup maps
  const sectionAssignmentMap = buildSectionAssignmentMap(
    (articleSections ?? []) as ArticleSectionRow[]
  );
  const entityMentionsMap = buildEntityMentionsMap(
    (articleEntities ?? []) as ArticleEntityRow[],
    entityNames
  );
  const articleById = new Map(articleList.map((a) => [a.id, a]));
  const subsectionsBySection = new Map<string, SubsectionRow[]>();
  for (const sub of allSubsections) {
    const arr = subsectionsBySection.get(sub.section_id) ?? [];
    arr.push(sub);
    subsectionsBySection.set(sub.section_id, arr);
  }

  // Order sections
  let orderedSections = allSections;
  if (config.sectionOrder && config.sectionOrder.length > 0) {
    const orderMap = new Map(config.sectionOrder.map((id, i) => [id, i]));
    orderedSections = [...allSections].sort((a, b) => {
      const ia = orderMap.get(a.id) ?? 999;
      const ib = orderMap.get(b.id) ?? 999;
      return ia !== ib ? ia - ib : a.display_order - b.display_order;
    });
  }

  // Build digest sections
  const digestSections: DigestSection[] = [];
  let totalItems = 0;

  for (const section of orderedSections) {
    // Get article IDs assigned to this section
    const assignedArticleIds = sectionAssignmentMap.get(section.id) ?? new Map<string | null, string[]>();

    // Build subsections
    const sectionSubsections = subsectionsBySection.get(section.id) ?? [];
    const digestSubsections: DigestSubsection[] = [];

    for (const sub of sectionSubsections) {
      const subArticleIds = assignedArticleIds.get(sub.id) ?? [];
      const subItems = buildDigestItems(
        subArticleIds,
        articleById,
        entityMentionsMap,
        maxItems
      );

      if (subItems.length > 0) {
        digestSubsections.push({ subsection: sub, items: subItems });
        totalItems += subItems.length;
      } else if (includeEmpty) {
        digestSubsections.push({ subsection: sub, items: [] });
      }
    }

    // Direct section articles (no subsection)
    const directArticleIds = assignedArticleIds.get(null) ?? [];
    const directItems = buildDigestItems(
      directArticleIds,
      articleById,
      entityMentionsMap,
      maxItems
    );
    totalItems += directItems.length;

    const hasItems =
      directItems.length > 0 ||
      digestSubsections.some((sub) => sub.items.length > 0);

    if (hasItems || includeEmpty) {
      digestSections.push({
        section,
        items: directItems,
        subsections: digestSubsections,
        hasItems,
      });
    }
  }

  return {
    date: config.date,
    overview: null,
    sections: digestSections,
    coverageStart,
    coverageEnd,
    totalItems,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns coverage window based on config or falls back to full calendar day.
 */
function resolveCoverageWindow(config: DigestConfig): {
  coverageStart: string;
  coverageEnd: string;
} {
  if (config.coverageStart && config.coverageEnd) {
    return {
      coverageStart: config.coverageStart,
      coverageEnd: config.coverageEnd,
    };
  }

  const date = config.date instanceof Date ? config.date : new Date(config.date);
  const coverageStart = new Date(date);
  coverageStart.setUTCHours(0, 0, 0, 0);

  const coverageEnd = new Date(date);
  coverageEnd.setUTCHours(23, 59, 59, 999);

  return {
    coverageStart: coverageStart.toISOString(),
    coverageEnd: coverageEnd.toISOString(),
  };
}

/**
 * Build a nested map: sectionId → Map<subsectionId | null, articleId[]>
 */
function buildSectionAssignmentMap(
  articleSections: ArticleSectionRow[]
): Map<string, Map<string | null, string[]>> {
  const map = new Map<string, Map<string | null, string[]>>();

  for (const as of articleSections) {
    if (!map.has(as.section_id)) {
      map.set(as.section_id, new Map());
    }
    const sectionMap = map.get(as.section_id)!;
    const key = as.subsection_id ?? null;
    const arr = sectionMap.get(key) ?? [];
    arr.push(as.article_id);
    sectionMap.set(key, arr);
  }

  return map;
}

/**
 * Build a map: articleId → entity name[]
 */
function buildEntityMentionsMap(
  articleEntities: ArticleEntityRow[],
  entityNames: Map<string, string>
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const ae of articleEntities) {
    const name = entityNames.get(ae.entity_id);
    if (!name) continue;
    const arr = map.get(ae.article_id) ?? [];
    if (!arr.includes(name)) arr.push(name);
    map.set(ae.article_id, arr);
  }

  return map;
}

function buildDigestItems(
  articleIds: string[],
  articleById: Map<string, ArticleRow>,
  entityMentionsMap: Map<string, string[]>,
  maxItems: number
): DigestItem[] {
  const items: DigestItem[] = [];
  const ids = maxItems > 0 ? articleIds.slice(0, maxItems) : articleIds;

  for (const id of ids) {
    const article = articleById.get(id);
    if (!article) continue;

    items.push({
      article,
      articleId: article.id,
      headline: article.translated_title ?? article.title,
      snippet: article.body_snippet
        ? extractSnippet(article.body_snippet, 200)
        : null,
      outletName: article.outlet_name_raw ?? "Unknown",
      publishedAt: article.published_at,
      url: article.canonical_url ?? article.url,
      entityMentions: entityMentionsMap.get(article.id) ?? [],
    });
  }

  return items;
}

// ─── Synchronous builder from pre-loaded data ─────────────────────────────────

/**
 * Article input shape expected by buildDigestFromArticles.
 */
export interface ArticleInput {
  id: string;
  title: string;
  outlet_name?: string | null;
  url: string;
  published_at?: string | null;
  section_id?: string | null;
  subsection_id?: string | null;
  priority_score?: number;
  body_snippet?: string | null;
}

/**
 * Section input shape expected by buildDigestFromArticles.
 */
export interface SectionInput {
  id: string;
  name: string;
  slug: string;
  display_order?: number;
  is_active?: boolean;
  description?: string | null;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Build a DigestData synchronously from pre-loaded article, section, and
 * subsection data. Useful for testing and client-side rendering without
 * making database calls.
 *
 * @param articles     Array of article records with section/subsection IDs
 * @param sections     Array of section records
 * @param subsections  Array of subsection records
 * @param config       Digest configuration
 */
export function buildDigestFromArticles(
  articles: ArticleInput[],
  sections: SectionInput[],
  subsections: SubsectionInput[],
  config: DigestConfig
): DigestData {
  const includeEmpty = config.includeEmptySections ?? DEFAULT_INCLUDE_EMPTY;
  const maxItems = config.maxItemsPerSection ?? DEFAULT_MAX_ITEMS;
  const date = config.date;

  // Sort sections by display_order
  const orderedSections = [...sections].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  // Apply optional section ordering from config
  if (config.sectionOrder && config.sectionOrder.length > 0) {
    const orderMap = new Map(config.sectionOrder.map((id: string, i: number) => [id, i]));
    orderedSections.sort((a, b) => {
      const ia = orderMap.get(a.id) ?? 999;
      const ib = orderMap.get(b.id) ?? 999;
      return ia !== ib ? ia - ib : (a.display_order ?? 0) - (b.display_order ?? 0);
    });
  }

  // Group articles by section and subsection
  const articlesBySection = new Map<string, Map<string | null, ArticleInput[]>>();
  for (const article of articles) {
    const sectionId = article.section_id;
    if (!sectionId) continue;

    if (!articlesBySection.has(sectionId)) {
      articlesBySection.set(sectionId, new Map());
    }
    const subMap = articlesBySection.get(sectionId)!;
    const key = article.subsection_id ?? null;
    const arr = subMap.get(key) ?? [];
    arr.push(article);
    subMap.set(key, arr);
  }

  // Group subsections by section
  const subsectionsBySection = new Map<string, SubsectionInput[]>();
  for (const sub of subsections) {
    const arr = subsectionsBySection.get(sub.section_id) ?? [];
    arr.push(sub);
    subsectionsBySection.set(sub.section_id, arr);
  }

  const digestSections: DigestSection[] = [];
  let totalItems = 0;

  for (const section of orderedSections) {
    const sectionArticleMap = articlesBySection.get(section.id) ?? new Map();

    // Build subsections
    const sectionSubsections = (subsectionsBySection.get(section.id) ?? [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    const digestSubsections: DigestSubsection[] = [];

    for (const sub of sectionSubsections) {
      const subArticles = (sectionArticleMap.get(sub.id) ?? ([] as ArticleInput[]))
        .sort((a: ArticleInput, b: ArticleInput) => (b.priority_score ?? 0) - (a.priority_score ?? 0));

      const limited = maxItems > 0 ? subArticles.slice(0, maxItems) : subArticles;
      const subItems: DigestItem[] = limited.map((a: ArticleInput) => ({
        articleId: a.id,
        headline: a.title,
        snippet: a.body_snippet ? extractSnippet(a.body_snippet, 200) : null,
        outletName: a.outlet_name ?? "Unknown",
        publishedAt: a.published_at ?? null,
        url: a.url,
        entityMentions: [],
      }));

      if (subItems.length > 0) {
        totalItems += subItems.length;
        digestSubsections.push({
          subsection: sub as SubsectionRow,
          items: subItems,
        });
      } else if (includeEmpty) {
        digestSubsections.push({
          subsection: sub as SubsectionRow,
          items: [],
        });
      }
    }

    // Direct articles in this section (no subsection)
    const directArticles = (sectionArticleMap.get(null) ?? ([] as ArticleInput[]))
      .sort((a: ArticleInput, b: ArticleInput) => (b.priority_score ?? 0) - (a.priority_score ?? 0));
    const limitedDirect = maxItems > 0 ? directArticles.slice(0, maxItems) : directArticles;
    const directItems: DigestItem[] = limitedDirect.map((a: ArticleInput) => ({
      articleId: a.id,
      headline: a.title,
      snippet: a.body_snippet ? extractSnippet(a.body_snippet, 200) : null,
      outletName: a.outlet_name ?? "Unknown",
      publishedAt: a.published_at ?? null,
      url: a.url,
      entityMentions: [],
    }));
    totalItems += directItems.length;

    const hasItems =
      directItems.length > 0 ||
      digestSubsections.some((sub) => sub.items.length > 0);

    if (hasItems || includeEmpty) {
      digestSections.push({
        section: section as SectionRow,
        items: directItems,
        subsections: digestSubsections,
        hasItems,
      });
    }
  }

  // Determine coverage window from config or date
  const refDate = date instanceof Date ? date : new Date(date);
  const coverageStart = new Date(refDate);
  coverageStart.setUTCHours(0, 0, 0, 0);
  const coverageEnd = new Date(refDate);
  coverageEnd.setUTCHours(23, 59, 59, 999);

  return {
    date,
    overview: null,
    sections: digestSections,
    coverageStart: coverageStart.toISOString(),
    coverageEnd: coverageEnd.toISOString(),
    totalItems,
  };
}
