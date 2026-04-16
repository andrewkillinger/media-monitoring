import type { RuleConditionRow } from "../../supabase/types";
import type { ConditionResult, ArticleForEvaluation } from "../types";

type SimpleField = "region" | "language" | "media_type" | "author";

/**
 * Evaluate simple scalar field conditions (region, language, media_type, author).
 */
export function evaluateRegionCondition(
  condition: RuleConditionRow,
  article: ArticleForEvaluation
): ConditionResult {
  const base: Omit<ConditionResult, "matched" | "matchedValue"> = {
    conditionId: condition.id,
    field: condition.field,
    operator: condition.operator,
  };

  if (!isRegionCondition(condition)) {
    return { ...base, matched: false };
  }

  const fieldValue = resolveField(article, condition.field as SimpleField);

  let matched = false;
  let matchedValue: string | null = null;

  const valueLower = condition.value.toLowerCase();
  const fieldLower = (fieldValue ?? "").toLowerCase();

  switch (condition.operator) {
    case "equals":
      matched = fieldLower === valueLower;
      if (matched) matchedValue = fieldValue;
      break;

    case "not_equals":
      matched = fieldLower !== valueLower;
      break;

    case "contains":
      matched = fieldLower.includes(valueLower);
      if (matched) matchedValue = fieldValue;
      break;

    case "not_contains":
      matched = !fieldLower.includes(valueLower);
      break;

    case "in_list": {
      const options = condition.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      matched = options.includes(fieldLower);
      if (matched) matchedValue = fieldValue;
      break;
    }

    case "not_in_list": {
      const options = condition.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      matched = !options.includes(fieldLower);
      break;
    }

    case "matches_regex":
      try {
        matched = new RegExp(condition.value, "i").test(fieldLower);
        if (matched) matchedValue = fieldValue;
      } catch {
        matched = false;
      }
      break;

    case "exists":
      matched = fieldValue !== null && fieldValue !== "";
      break;

    case "not_exists":
      matched = fieldValue === null || fieldValue === "";
      break;

    default:
      matched = false;
  }

  if (condition.is_negated) matched = !matched;
  return { ...base, matched, matchedValue };
}

/**
 * Check whether a condition targets a scalar / region-style field.
 */
export function isRegionCondition(condition: RuleConditionRow): boolean {
  return ["region", "language", "media_type", "author"].includes(
    condition.field
  );
}

function resolveField(
  article: ArticleForEvaluation,
  field: SimpleField
): string | null {
  switch (field) {
    case "region":
      return article.region ?? null;
    case "language":
      return article.language;
    case "media_type":
      return article.mediaType ?? null;
    case "author":
      // author is not on ArticleForEvaluation directly; check metadata
      return (article.metadata?.author as string | undefined) ?? null;
    default:
      return null;
  }
}
