import { createAdminClient } from "../supabase/admin";
import type {
  ArticleRow,
  ArticleSectionRow,
  ArticleEntityRow,
  EntityRow,
  SectionRow,
  SubsectionRow,
} from "../supabase/types";
import type {
  DigestConfig,
  DigestData,
  DigestSection,
  DigestSubsection,
  DigestItem,
} from "./types";
import { extractSnippet } from "../pipeline/normalize";

// ─── Default configuration ────────────────────────────────────────────────────

const DEFAULT_INCLUDE_STATUSES = ["classified", "reviewed", "published"];
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
  if (articleEntities && articleEntities.length > 0) {
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

  const date = new Date(config.date);
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
