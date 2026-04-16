import type {
  RuleConditionRow,
  RuleActionRow,
  MatchMode,
} from "../supabase/types";
import type {
  ArticleForEvaluation,
  ClassificationResult,
  ConditionGroup,
  ConditionResult,
  EvaluationContext,
  EntityMatch,
  EntityWithAliases,
  OutletInfo,
  OutletWithTier,
  RuleEvaluationResult,
  RuleWithConditionsAndActions,
} from "./types";
import { EntityIndex } from "./matchers/entity.matcher";
import { evaluateKeywordCondition, isKeywordCondition } from "./matchers/keyword.matcher";
import { evaluateOutletCondition, isOutletCondition } from "./matchers/outlet.matcher";
import { evaluateRegionCondition, isRegionCondition } from "./matchers/region.matcher";

// ─── Outlet info input ────────────────────────────────────────────────────────

export interface OutletInfoInput {
  id: string;
  name: string;
  tier: string;
  channel: string;
  isPriority?: boolean;
  is_priority?: boolean;
  isExcluded?: boolean;
  is_excluded?: boolean;
  listIds?: string[];
}

// ─── RuleEngine constructor options ──────────────────────────────────────────

export interface RuleEngineOptions {
  rules: RuleWithConditionsAndActions[];
  entities: EntityWithAliases[];
  /** Accepts either OutletInfoInput or OutletWithTier (from tests) */
  outlets: Array<OutletInfoInput | OutletWithTier>;
  /** Optional map of outlet name → OutletInfoInput for fast lookup */
  outletsByName?: Map<string, OutletInfoInput>;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class RuleEngine {
  private readonly sortedRules: RuleWithConditionsAndActions[];
  private readonly entityIndex: EntityIndex;
  private readonly outletsByName: Map<string, OutletInfoInput>;
  private readonly outletsBySlug: Map<string, OutletInfoInput>;

  constructor(options: RuleEngineOptions) {
    // Sort: exclusion rules first, then by priority ascending (lower = higher priority)
    this.sortedRules = [...options.rules]
      .filter((r) => r.is_active)
      .sort((a, b) => {
        const aIsExclusion = a.rule_type === "exclusion" ? 0 : 1;
        const bIsExclusion = b.rule_type === "exclusion" ? 0 : 1;
        if (aIsExclusion !== bIsExclusion) return aIsExclusion - bIsExclusion;
        return a.priority - b.priority;
      });

    this.entityIndex = new EntityIndex(options.entities);

    this.outletsByName = new Map();
    this.outletsBySlug = new Map();
    for (const outlet of options.outlets) {
      // Normalize either OutletInfoInput or OutletWithTier to internal format
      const normalized: OutletInfoInput = {
        id: outlet.id,
        name: outlet.name,
        tier: outlet.tier,
        channel: outlet.channel,
        isPriority: "isPriority" in outlet ? outlet.isPriority : ("is_priority" in outlet ? (outlet as OutletWithTier).is_priority : false),
        isExcluded: "isExcluded" in outlet ? outlet.isExcluded : false,
        listIds: "listIds" in outlet ? outlet.listIds : [],
      };
      this.outletsByName.set(outlet.name.toLowerCase(), normalized);
    }
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  classify(article: ArticleForEvaluation): ClassificationResult {
    // Step 1: Entity matching
    const entityMatches = this.entityIndex.findMatches(
      { title: article.title, bodyText: article.bodyText }
    );

    // Step 2: Resolve outlet info
    const outletInfo = this.resolveOutlet(article.outletName);

    // Step 3: Build evaluation context
    const context: EvaluationContext = {
      article,
      entityMatches,
      outletInfo,
      resolvedTags: [],
    };

    // Step 4: Evaluate rules
    const appliedRules: RuleEvaluationResult[] = [];
    const assignedSections: ClassificationResult["assignedSections"] = [];
    const assignedTags: string[] = [];
    let isExcluded = false;
    let excludedByRule: string | null = null;
    let needsReview = false;
    const alerts: ClassificationResult["alerts"] = [];
    let priorityScore = 0;

    for (const rule of this.sortedRules) {
      const result = this.evaluateRule(rule, context);

      if (!result.matched) continue;

      appliedRules.push(result);

      // Process actions
      for (const action of result.actions) {
        switch (action.action_type) {
          case "exclude":
            isExcluded = true;
            excludedByRule = rule.id;
            break;

          case "assign_section":
            if (action.target_id) {
              assignedSections.push({
                sectionId: action.target_id,
                subsectionId: null,
                assignedByRuleId: rule.id,
              });
            }
            break;

          case "assign_subsection":
            if (action.target_id) {
              // Find the most recently assigned section and attach subsection
              const parentSectionId =
                (action.metadata?.sectionId as string | undefined) ?? null;
              const lastSection =
                assignedSections.find((s) => s.sectionId === parentSectionId) ??
                assignedSections[assignedSections.length - 1];

              if (lastSection) {
                lastSection.subsectionId = action.target_id;
              } else if (parentSectionId) {
                // Create section+subsection pair
                assignedSections.push({
                  sectionId: parentSectionId,
                  subsectionId: action.target_id,
                  assignedByRuleId: rule.id,
                });
              }
            }
            break;

          case "add_tag":
            if (action.target_value && !assignedTags.includes(action.target_value)) {
              assignedTags.push(action.target_value);
              context.resolvedTags.push(action.target_value);
            }
            break;

          case "set_priority":
            if (action.target_value) {
              const delta = parseInt(action.target_value, 10);
              if (!isNaN(delta)) priorityScore += delta;
            }
            break;

          case "trigger_alert":
            alerts.push({
              severity:
                (action.target_value as string | undefined) ??
                (action.metadata?.severity as string | undefined) ??
                "medium",
              ruleId: rule.id,
              ruleName: rule.name,
              targetValue: action.target_value ?? null,
            });
            break;

          case "flag_review":
            needsReview = true;
            break;

          case "set_sentiment":
            // Sentiment is set on the article by the pipeline, not here
            break;
        }
      }

      // Short-circuit on exclusion
      if (isExcluded) break;
    }

    return {
      articleId: article.id,
      appliedRules,
      assignedSections,
      assignedTags,
      isExcluded,
      excludedByRule,
      needsReview,
      alerts,
      priorityScore,
      entityMatches,
    };
  }

  classifyBatch(articles: ArticleForEvaluation[]): ClassificationResult[] {
    return articles.map((a) => this.classify(a));
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private evaluateRule(
    rule: RuleWithConditionsAndActions,
    context: EvaluationContext
  ): RuleEvaluationResult {
    const allConditionResults: ConditionResult[] = [];

    if (rule.conditions.length === 0) {
      // A rule with no conditions matches everything
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        matched: true,
        actions: rule.actions,
        matchDetails: [],
      };
    }

    // Group conditions by group_id
    const groups = groupConditions(rule.conditions);

    // Each group is evaluated independently; the rule's match_mode determines
    // how groups are combined (all groups must pass for "all", any for "any")
    const groupResults: boolean[] = [];

    for (const group of groups) {
      const condResults = group.conditions.map((condition) =>
        this.evaluateCondition(condition, context)
      );
      allConditionResults.push(...condResults);

      const groupMatched = evaluateGroupResults(condResults, group.mode);
      groupResults.push(groupMatched);
    }

    const ruleMatched = evaluateGroupResults(
      groupResults.map((m, i) => ({
        matched: m,
        conditionId: `group-${i}`,
        field: "title" as const,
        operator: "contains" as const,
      })),
      rule.match_mode
    );

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched: ruleMatched,
      actions: rule.actions,
      matchDetails: allConditionResults,
    };
  }

  private evaluateCondition(
    condition: RuleConditionRow,
    context: EvaluationContext
  ): ConditionResult {
    const { article, entityMatches, outletInfo } = context;

    if (isKeywordCondition(condition)) {
      return evaluateKeywordCondition(condition, article);
    }

    if (isOutletCondition(condition)) {
      return evaluateOutletCondition(
        condition,
        outletInfo,
        article.outletName
      );
    }

    if (isRegionCondition(condition)) {
      return evaluateRegionCondition(condition, article);
    }

    // Entity / product / disease_state conditions
    if (
      condition.field === "entity" ||
      condition.field === "product" ||
      condition.field === "disease_state"
    ) {
      return this.evaluateEntityCondition(condition, entityMatches);
    }

    // Tag condition
    if (condition.field === "tag") {
      return this.evaluateTagCondition(condition, context.resolvedTags);
    }

    // Sentiment condition — not evaluated here (requires AI)
    return {
      conditionId: condition.id,
      field: condition.field,
      operator: condition.operator,
      matched: false,
    };
  }

  private evaluateEntityCondition(
    condition: RuleConditionRow,
    entityMatches: EntityMatch[]
  ): ConditionResult {
    const base = {
      conditionId: condition.id,
      field: condition.field,
      operator: condition.operator,
    };

    const targetValue = condition.value.toLowerCase();

    let candidates: string[] = [];
    switch (condition.field) {
      case "entity":
        candidates = entityMatches.flatMap((m) => [
          m.entityId,
          m.entityName.toLowerCase(),
          m.matchedAlias.toLowerCase(),
        ]);
        break;
      case "product":
        candidates = entityMatches.flatMap((m) =>
          m.products.map((p) => p.toLowerCase())
        );
        break;
      case "disease_state":
        candidates = entityMatches.flatMap((m) =>
          m.diseaseStates.map((d) => d.toLowerCase())
        );
        break;
    }

    let matched = false;
    let matchedValue: string | null = null;

    switch (condition.operator) {
      case "in_list":
      case "equals": {
        const targets = targetValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const found = candidates.find((c) => targets.includes(c));
        matched = Boolean(found);
        if (matched && found) matchedValue = found;
        break;
      }
      case "not_in_list":
      case "not_equals": {
        const targets = targetValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        matched = !candidates.some((c) => targets.includes(c));
        break;
      }
      case "contains":
        matched = candidates.some((c) => c.includes(targetValue));
        if (matched) matchedValue = targetValue;
        break;
      case "not_contains":
        matched = !candidates.some((c) => c.includes(targetValue));
        break;
      case "exists":
        matched = candidates.length > 0;
        break;
      case "not_exists":
        matched = candidates.length === 0;
        break;
      default:
        matched = false;
    }

    if (condition.is_negated) matched = !matched;
    return { ...base, matched, matchedValue };
  }

  private evaluateTagCondition(
    condition: RuleConditionRow,
    resolvedTags: string[]
  ): ConditionResult {
    const base = {
      conditionId: condition.id,
      field: condition.field,
      operator: condition.operator,
    };

    const targetValue = condition.value.toLowerCase();
    const tags = resolvedTags.map((t) => t.toLowerCase());

    let matched = false;
    let matchedValue: string | null = null;

    switch (condition.operator) {
      case "in_list":
      case "equals": {
        const targets = targetValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const found = tags.find((t) => targets.includes(t));
        matched = Boolean(found);
        if (matched && found) matchedValue = found;
        break;
      }
      case "not_in_list":
      case "not_equals": {
        const targets = targetValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        matched = !tags.some((t) => targets.includes(t));
        break;
      }
      case "exists":
        matched = tags.length > 0;
        break;
      case "not_exists":
        matched = tags.length === 0;
        break;
      default:
        matched = false;
    }

    if (condition.is_negated) matched = !matched;
    return { ...base, matched, matchedValue };
  }

  private resolveOutlet(outletName: string | null): OutletInfo | null {
    if (!outletName) return null;
    const outlet = this.outletsByName.get(outletName.toLowerCase());
    if (!outlet) return null;
    return {
      id: outlet.id,
      name: outlet.name,
      tier: outlet.tier,
      channel: outlet.channel,
      listIds: outlet.listIds ?? [],
      isPriority: outlet.isPriority ?? outlet.is_priority ?? false,
      isExcluded: outlet.isExcluded ?? outlet.is_excluded ?? false,
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupConditions(conditions: RuleConditionRow[]): ConditionGroup[] {
  const groupMap = new Map<number, ConditionGroup>();

  for (const condition of conditions) {
    const gid = condition.group_id;
    if (!groupMap.has(gid)) {
      groupMap.set(gid, {
        groupId: gid,
        mode: condition.group_mode,
        conditions: [],
      });
    }
    groupMap.get(gid)!.conditions.push(condition);
  }

  return Array.from(groupMap.values()).sort((a, b) => a.groupId - b.groupId);
}

function evaluateGroupResults(
  results: Array<{ matched: boolean }>,
  mode: MatchMode
): boolean {
  if (results.length === 0) return true;
  if (mode === "all") return results.every((r) => r.matched);
  return results.some((r) => r.matched);
}
