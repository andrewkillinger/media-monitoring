import type {
  RuleRow,
  RuleConditionRow,
  RuleActionRow,
  EntityRow,
  EntityAliasRow,
  ConditionField,
  ConditionOperator,
  MatchMode,
} from "../supabase/types";

// ─── Entity with its aliases (re-exported from here for convenience) ──────────

export interface EntityWithAliases extends EntityRow {
  aliases: Array<Pick<EntityAliasRow, "alias_text" | "is_primary">>;
  /** Product names if this entity has related product entities */
  products?: string[];
  /** Disease state names associated with this entity */
  diseaseStates?: string[];
}

// ─── Outlet with tier info (for engine construction) ─────────────────────────

export interface OutletWithTier {
  id: string;
  name: string;
  slug: string;
  tier: string;
  channel: string;
  is_priority?: boolean;
  listIds?: string[];
}

// ─── Article representation for rule evaluation ───────────────────────────────

export interface ArticleForEvaluation {
  id: string;
  title: string;
  /** Lowercase, normalized version of the title */
  titleNormalized: string;
  /** Plain-text body content */
  bodyText: string | null;
  /** Combined title + body for full-text matching */
  fullText: string;
  outletName: string | null;
  /** BCP-47 language code */
  language: string;
  /** Geographic region */
  region: string | null;
  /** Media type string: "article", "tweet", "pdf", etc. */
  mediaType: string | null;
  /** Channel type: "online", "print", "broadcast", "social", "wire" */
  channel?: string;
  publishedAt: string | Date | null;
  /** Arbitrary extra metadata from the source adapter */
  metadata: Record<string, unknown>;
}

// ─── Entity matching results ──────────────────────────────────────────────────

export interface EntityMatch {
  entityId: string;
  entityName: string;
  /** The specific alias text that was matched */
  matchedAlias: string;
  /** Where in the article the entity was found */
  matchLocation: "title" | "body" | "both";
  isCompetitor: boolean;
  /** Product names associated with this entity */
  products: string[];
  /** Disease state / therapeutic area names associated with this entity */
  diseaseStates: string[];
}

// ─── Evaluation context assembled before rule processing ─────────────────────

export interface EvaluationContext {
  article: ArticleForEvaluation;
  /** All entity matches found in this article */
  entityMatches: EntityMatch[];
  /** Outlet record info if the outlet was resolved from the database */
  outletInfo: OutletInfo | null;
  /** Tags already assigned to this article (for tag-based conditions) */
  resolvedTags: string[];
}

export interface OutletInfo {
  id: string;
  name: string;
  tier: string;
  channel: string;
  /** IDs of outlet lists this outlet belongs to */
  listIds: string[];
  isPriority: boolean;
  isExcluded: boolean;
}

// ─── Per-condition evaluation result ─────────────────────────────────────────

export interface ConditionResult {
  conditionId: string;
  field: ConditionField;
  operator: ConditionOperator;
  /** Whether this condition matched */
  matched: boolean;
  /** The value(s) that caused the match (for logging) */
  matchedValue?: string | null;
}

// ─── Per-rule evaluation result ───────────────────────────────────────────────

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  /** Whether the rule's condition set matched the article */
  matched: boolean;
  /** Actions to apply if matched */
  actions: RuleActionRow[];
  /** Detailed condition results for debugging */
  matchDetails: ConditionResult[];
}

// ─── Final classification output for one article ─────────────────────────────

export interface ClassificationResult {
  articleId: string;
  /** All rules that were evaluated, in evaluation order */
  appliedRules: RuleEvaluationResult[];
  /** Section IDs to assign */
  assignedSections: Array<{
    sectionId: string;
    subsectionId: string | null;
    assignedByRuleId: string;
  }>;
  /** Tags to add */
  assignedTags: string[];
  /** Whether this article should be excluded from digests */
  isExcluded: boolean;
  /** ID of the rule that caused exclusion */
  excludedByRule: string | null;
  /** Whether a human reviewer should check this article */
  needsReview: boolean;
  /** Alert / flag types to trigger */
  alerts: Array<{
    severity: string;
    ruleId: string;
    ruleName: string;
    targetValue: string | null;
  }>;
  /** Computed priority score (sum of set_priority actions) */
  priorityScore: number;
  /** Entity matches found */
  entityMatches: EntityMatch[];
}

// ─── Rule with its associated conditions and actions ─────────────────────────

export interface RuleWithConditionsAndActions extends RuleRow {
  conditions: RuleConditionRow[];
  actions: RuleActionRow[];
}

// ─── Condition group (conditions sharing the same group_id) ──────────────────

export interface ConditionGroup {
  groupId: number;
  mode: MatchMode;
  conditions: RuleConditionRow[];
}
