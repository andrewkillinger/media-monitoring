import { createAdminClient } from "../supabase/admin";
import type {
  ArticleRow,
  RuleRow,
  RuleConditionRow,
  RuleActionRow,
  EntityRow,
  EntityAliasRow,
  EntityDiseaseStateRow,
  DiseaseStateRow,
  OutletRow,
  OutletListMemberRow,
  ArticleUpdate,
  ArticleSectionInsert,
  ArticleEntityInsert,
  ItemFlagInsert,
} from "../supabase/types";
import { RuleEngine } from "../rules/engine";
import type { ArticleForEvaluation, ClassificationResult } from "../rules/types";
import type { RuleWithConditionsAndActions } from "../rules/types";
import type { EntityWithAliases } from "../rules/matchers/entity.matcher";
import type { OutletInfoInput } from "../rules/engine";
import { normalizeTitle } from "./normalize";

// ─── Result type ──────────────────────────────────────────────────────────────

export interface ClassifyResult {
  articleId: string;
  success: boolean;
  error?: string;
  sectionsAssigned: number;
  entitiesMatched: number;
  isExcluded: boolean;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Classify one or more articles by loading rules, entities, and outlets from
 * the database, then running the rule engine and writing results back.
 *
 * @param articleIds  Array of article UUIDs to classify. If empty, classifies
 *                    all articles with status = "pending".
 */
export async function classifyArticles(
  articleIds: string[] = []
): Promise<ClassifyResult[]> {
  const db = createAdminClient();

  // Load articles
  let articlesQuery = db.from("articles").select("*").in("status", ["pending"]);

  if (articleIds.length > 0) {
    articlesQuery = db.from("articles").select("*").in("id", articleIds);
  }

  const { data: articles, error: articlesError } = await articlesQuery;
  if (articlesError) {
    throw new Error(`Failed to load articles: ${articlesError.message}`);
  }
  if (!articles || articles.length === 0) return [];

  // Load rules, conditions, and actions
  const rules = await loadRules(db);
  if (rules.length === 0) {
    // No rules — mark articles as classified with no sections
    return markArticlesClassified(db, articles as ArticleRow[]);
  }

  // Load entities
  const entities = await loadEntities(db);

  // Load outlets and their list memberships
  const outlets = await loadOutlets(db);

  // Build the rule engine
  const engine = new RuleEngine({ rules, entities, outlets });

  const results: ClassifyResult[] = [];

  for (const article of articles as ArticleRow[]) {
    try {
      const articleForEval = toArticleForEvaluation(article);
      const classification = engine.classify(articleForEval);

      await applyClassification(db, article, classification);

      results.push({
        articleId: article.id,
        success: true,
        sectionsAssigned: classification.assignedSections.length,
        entitiesMatched: classification.entityMatches.length,
        isExcluded: classification.isExcluded,
      });
    } catch (err) {
      results.push({
        articleId: article.id,
        success: false,
        error: (err as Error).message,
        sectionsAssigned: 0,
        entitiesMatched: 0,
        isExcluded: false,
      });
    }
  }

  return results;
}

// ─── Apply classification results to the database ────────────────────────────

async function applyClassification(
  db: ReturnType<typeof createAdminClient>,
  article: ArticleRow,
  result: ClassificationResult
): Promise<void> {
  // 1. Determine new article status
  const newStatus = result.isExcluded
    ? "excluded"
    : "classified";

  // 2. Update the article record
  const articleUpdate: ArticleUpdate = {
    status: newStatus as ArticleUpdate["status"],
    priority_score: result.priorityScore,
    review_status: result.needsReview ? "needs_review" : null,
    exclusion_rationale: result.isExcluded
      ? `Excluded by rule: ${result.excludedByRule}`
      : null,
    updated_at: new Date().toISOString(),
  };
  await db
    .from("articles")
    .update(articleUpdate)
    .eq("id", article.id);

  // 3. Delete existing auto-assigned sections (re-classification)
  await db
    .from("article_sections")
    .delete()
    .eq("article_id", article.id)
    .eq("is_manual_override", false);

  // 4. Insert new section assignments
  if (result.assignedSections.length > 0) {
    const sectionInserts: ArticleSectionInsert[] = result.assignedSections.map((s) => ({
      article_id: article.id,
      section_id: s.sectionId,
      subsection_id: s.subsectionId,
      assigned_by_rule_id: s.assignedByRuleId,
      is_manual_override: false,
    }));
    await db.from("article_sections").insert(sectionInserts);
  }

  // 5. Delete existing auto-assigned entities
  await db
    .from("article_entities")
    .delete()
    .eq("article_id", article.id);

  // 6. Insert entity matches
  if (result.entityMatches.length > 0) {
    const entityInserts: ArticleEntityInsert[] = result.entityMatches.map((m, idx) => ({
      article_id: article.id,
      entity_id: m.entityId,
      matched_alias: m.matchedAlias,
      match_location: m.matchLocation,
      is_primary_mention: idx === 0,
    }));
    await db.from("article_entities").insert(entityInserts);
  }

  // 7. Create item_flags for alerts
  if (result.alerts.length > 0) {
    for (const alert of result.alerts) {
      const flagInsert: ItemFlagInsert = {
        article_id: article.id,
        flag_type: "custom",
        severity: (alert.severity as "critical" | "high" | "medium" | "low") ?? "medium",
        status: "new",
        title: `Alert: ${alert.ruleName}`,
        notes: alert.targetValue ?? null,
      };
      await db.from("item_flags").insert(flagInsert);
    }
  }
}

// ─── Mark articles as classified with no changes ─────────────────────────────

async function markArticlesClassified(
  db: ReturnType<typeof createAdminClient>,
  articles: ArticleRow[]
): Promise<ClassifyResult[]> {
  for (const article of articles) {
    const upd: ArticleUpdate = { status: "classified", updated_at: new Date().toISOString() };
    await db
      .from("articles")
      .update(upd)
      .eq("id", article.id);
  }

  return articles.map((a) => ({
    articleId: a.id,
    success: true,
    sectionsAssigned: 0,
    entitiesMatched: 0,
    isExcluded: false,
  }));
}

// ─── Data loading helpers ─────────────────────────────────────────────────────

async function loadRules(
  db: ReturnType<typeof createAdminClient>
): Promise<RuleWithConditionsAndActions[]> {
  const { data: rules } = await db
    .from("rules")
    .select("*")
    .eq("is_active", true)
    .order("priority");

  if (!rules || rules.length === 0) return [];

  const ruleIds = (rules as RuleRow[]).map((r) => r.id);

  const [conditionsRes, actionsRes] = await Promise.all([
    db.from("rule_conditions").select("*").in("rule_id", ruleIds),
    db.from("rule_actions").select("*").in("rule_id", ruleIds),
  ]);

  const conditionsByRule = new Map<string, RuleConditionRow[]>();
  const actionsByRule = new Map<string, RuleActionRow[]>();

  for (const cond of (conditionsRes.data ?? []) as RuleConditionRow[]) {
    const arr = conditionsByRule.get(cond.rule_id) ?? [];
    arr.push(cond);
    conditionsByRule.set(cond.rule_id, arr);
  }

  for (const action of (actionsRes.data ?? []) as RuleActionRow[]) {
    const arr = actionsByRule.get(action.rule_id) ?? [];
    arr.push(action);
    actionsByRule.set(action.rule_id, arr);
  }

  return (rules as RuleRow[]).map((rule) => ({
    ...rule,
    conditions: conditionsByRule.get(rule.id) ?? [],
    actions: actionsByRule.get(rule.id) ?? [],
  }));
}

async function loadEntities(
  db: ReturnType<typeof createAdminClient>
): Promise<EntityWithAliases[]> {
  const [entitiesRes, aliasesRes, edStateRes, diseaseStatesRes] =
    await Promise.all([
      db.from("entities").select("*").eq("is_active", true),
      db.from("entity_aliases").select("*"),
      db.from("entity_disease_states").select("*"),
      db.from("disease_states").select("id, name").eq("is_active", true),
    ]);

  const entities = (entitiesRes.data ?? []) as EntityRow[];
  const aliases = (aliasesRes.data ?? []) as EntityAliasRow[];
  const edStates = (edStateRes.data ?? []) as EntityDiseaseStateRow[];
  const diseaseStates = (diseaseStatesRes.data ?? []) as DiseaseStateRow[];

  const dsById = new Map<string, string>();
  for (const ds of diseaseStates) {
    dsById.set(ds.id, ds.name);
  }

  const aliasesByEntityId = new Map<string, EntityAliasRow[]>();
  for (const alias of aliases) {
    const arr = aliasesByEntityId.get(alias.entity_id) ?? [];
    arr.push(alias);
    aliasesByEntityId.set(alias.entity_id, arr);
  }

  const dsByEntityId = new Map<string, string[]>();
  for (const eds of edStates) {
    const arr = dsByEntityId.get(eds.entity_id) ?? [];
    const dsName = dsById.get(eds.disease_state_id);
    if (dsName) arr.push(dsName);
    dsByEntityId.set(eds.entity_id, arr);
  }

  return entities.map((entity) => ({
    ...entity,
    aliases: aliasesByEntityId.get(entity.id) ?? [],
    diseaseStates: dsByEntityId.get(entity.id) ?? [],
    products: [], // Products are child entities — resolved separately if needed
  }));
}

async function loadOutlets(
  db: ReturnType<typeof createAdminClient>
): Promise<OutletInfoInput[]> {
  const [outletsRes, membersRes] = await Promise.all([
    db.from("outlets").select("*"),
    db.from("outlet_list_members").select("outlet_id, outlet_list_id"),
  ]);

  const outlets = (outletsRes.data ?? []) as OutletRow[];
  const members = (membersRes.data ?? []) as OutletListMemberRow[];

  const listsByOutletId = new Map<string, string[]>();
  for (const member of members) {
    const arr = listsByOutletId.get(member.outlet_id) ?? [];
    arr.push(member.outlet_list_id);
    listsByOutletId.set(member.outlet_id, arr);
  }

  return outlets.map((outlet) => ({
    id: outlet.id,
    name: outlet.name,
    tier: outlet.tier,
    channel: outlet.channel,
    isPriority: outlet.is_priority,
    isExcluded: outlet.is_excluded,
    listIds: listsByOutletId.get(outlet.id) ?? [],
  }));
}

// ─── Conversion helpers ───────────────────────────────────────────────────────

function toArticleForEvaluation(article: ArticleRow): ArticleForEvaluation {
  const bodyText = article.body_snippet ?? null;
  const title = article.title ?? "";
  const fullText = [title, bodyText].filter(Boolean).join(" ");

  return {
    id: article.id,
    title,
    titleNormalized:
      article.title_normalized ?? normalizeTitle(title),
    bodyText,
    fullText,
    outletName: article.outlet_name_raw ?? null,
    language: article.language,
    region: article.region ?? null,
    mediaType: article.media_type ?? null,
    publishedAt: article.published_at ?? null,
    metadata: (article.metadata ?? {}) as Record<string, unknown>,
  };
}
