import type { RuleConditionRow } from "../../supabase/types";
import type { ConditionResult, ArticleForEvaluation, EvaluationContext } from "../types";
import { escapeRegex } from "../../utils/text";

/**
 * Supported text fields for keyword matching.
 */
const TEXT_FIELDS = new Set(["title", "body", "full_text"]);

/**
 * Resolve which article text to search based on the condition field.
 */
function resolveText(
  article: ArticleForEvaluation,
  field: string
): string {
  switch (field) {
    case "title":
      return article.titleNormalized || article.title.toLowerCase();
    case "body":
      return (article.bodyText ?? "").toLowerCase();
    case "full_text":
      return article.fullText.toLowerCase();
    default:
      return "";
  }
}

/**
 * Evaluate a single keyword / regex condition against the given text field.
 *
 * Supported operators:
 *   - contains      : case-insensitive substring match
 *   - not_contains  : inverse of contains
 *   - matches_regex : full regex match (case-insensitive by default)
 */
export function evaluateKeywordCondition(
  condition: RuleConditionRow,
  article: ArticleForEvaluation
): ConditionResult {
  const base: Omit<ConditionResult, "matched" | "matchedValue"> = {
    conditionId: condition.id,
    field: condition.field,
    operator: condition.operator,
  };

  if (!TEXT_FIELDS.has(condition.field)) {
    // Not a text field — this matcher doesn't handle it
    return { ...base, matched: false };
  }

  const haystack = resolveText(article, condition.field);

  let matched = false;
  let matchedValue: string | null = null;

  switch (condition.operator) {
    case "contains": {
      const needle = condition.value.toLowerCase();
      matched = haystack.includes(needle);
      if (matched) matchedValue = condition.value;
      break;
    }

    case "not_contains": {
      const needle = condition.value.toLowerCase();
      matched = !haystack.includes(needle);
      break;
    }

    case "matches_regex": {
      try {
        const flags = condition.value.startsWith("(?i)") ? "i" : "i";
        const pattern = condition.value.startsWith("(?i)")
          ? condition.value.slice(4)
          : condition.value;
        const rx = new RegExp(pattern, flags);
        const result = rx.exec(haystack);
        matched = result !== null;
        if (matched && result) matchedValue = result[0];
      } catch {
        // Invalid regex — treat as non-match
        matched = false;
      }
      break;
    }

    default:
      matched = false;
  }

  // Apply negation
  if (condition.is_negated) matched = !matched;

  return { ...base, matched, matchedValue };
}

/**
 * Check whether a condition targets a text field that this matcher handles.
 */
export function isKeywordCondition(condition: RuleConditionRow): boolean {
  return TEXT_FIELDS.has(condition.field);
}

/**
 * Build a case-insensitive "contains" test for a list of keywords.
 * Returns the first matching keyword or null.
 */
export function findFirstKeywordMatch(
  text: string,
  keywords: string[]
): string | null {
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) return kw;
  }
  return null;
}

/**
 * Build a single regex that matches any of the provided terms.
 * Use for batch matching when you don't need per-term results.
 */
export function buildKeywordRegex(terms: string[]): RegExp {
  const escaped = terms.map(escapeRegex);
  return new RegExp(`(?:${escaped.join("|")})`, "i");
}

// ─── KeywordMatcher class (for tests and direct use) ─────────────────────────

/**
 * Stateless class wrapper around evaluateKeywordCondition.
 * Returns a boolean directly from evaluate() for simpler usage.
 */
export class KeywordMatcher {
  /**
   * Evaluate a keyword condition against an article or evaluation context.
   * Returns true if the condition matches.
   */
  evaluate(
    condition: RuleConditionRow,
    contextOrArticle: EvaluationContext | ArticleForEvaluation
  ): boolean {
    const article =
      "article" in contextOrArticle
        ? contextOrArticle.article
        : contextOrArticle;

    const result = evaluateKeywordCondition(condition, article);
    return result.matched;
  }
}
