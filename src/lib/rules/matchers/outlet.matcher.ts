import type { RuleConditionRow } from "../../supabase/types";
import type { ConditionResult, OutletInfo } from "../types";

/**
 * Evaluate outlet-related conditions.
 *
 * Handles the following condition fields:
 *   - "outlet"      : match against the article's outlet name
 *   - "outlet_list" : match against outlet list IDs the outlet belongs to
 */
export function evaluateOutletCondition(
  condition: RuleConditionRow,
  outletInfo: OutletInfo | null,
  outletNameRaw: string | null
): ConditionResult {
  const base: Omit<ConditionResult, "matched" | "matchedValue"> = {
    conditionId: condition.id,
    field: condition.field,
    operator: condition.operator,
  };

  if (condition.field === "outlet") {
    return evaluateOutletName(condition, base, outletInfo, outletNameRaw);
  }

  if (condition.field === "outlet_list") {
    return evaluateOutletList(condition, base, outletInfo);
  }

  return { ...base, matched: false };
}

function evaluateOutletName(
  condition: RuleConditionRow,
  base: Omit<ConditionResult, "matched" | "matchedValue">,
  outletInfo: OutletInfo | null,
  outletNameRaw: string | null
): ConditionResult {
  const name = (outletInfo?.name ?? outletNameRaw ?? "").toLowerCase();
  const value = condition.value.toLowerCase();

  let matched = false;
  let matchedValue: string | null = null;

  switch (condition.operator) {
    case "contains":
      matched = name.includes(value);
      if (matched) matchedValue = condition.value;
      break;

    case "not_contains":
      matched = !name.includes(value);
      break;

    case "equals":
      matched = name === value;
      if (matched) matchedValue = condition.value;
      break;

    case "not_equals":
      matched = name !== value;
      break;

    case "matches_regex":
      try {
        matched = new RegExp(condition.value, "i").test(name);
        if (matched) matchedValue = name;
      } catch {
        matched = false;
      }
      break;

    case "in_list": {
      // value is a comma-separated list of outlet names
      const names = condition.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      matched = names.includes(name);
      if (matched) matchedValue = name;
      break;
    }

    case "not_in_list": {
      const names = condition.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      matched = !names.includes(name);
      break;
    }

    case "exists":
      matched = Boolean(outletInfo?.id || outletNameRaw);
      break;

    case "not_exists":
      matched = !outletInfo?.id && !outletNameRaw;
      break;

    default:
      matched = false;
  }

  if (condition.is_negated) matched = !matched;
  return { ...base, matched, matchedValue };
}

function evaluateOutletList(
  condition: RuleConditionRow,
  base: Omit<ConditionResult, "matched" | "matchedValue">,
  outletInfo: OutletInfo | null
): ConditionResult {
  const listIds = outletInfo?.listIds ?? [];

  let matched = false;
  let matchedValue: string | null = null;

  switch (condition.operator) {
    case "in_list":
    case "equals": {
      // condition.value is either a single list ID or comma-separated list IDs
      const targetIds = condition.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const found = targetIds.find((id) => listIds.includes(id));
      matched = Boolean(found);
      if (matched && found) matchedValue = found;
      break;
    }

    case "not_in_list":
    case "not_equals": {
      const targetIds = condition.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      matched = !targetIds.some((id) => listIds.includes(id));
      break;
    }

    case "exists":
      matched = listIds.length > 0;
      break;

    case "not_exists":
      matched = listIds.length === 0;
      break;

    default:
      matched = false;
  }

  if (condition.is_negated) matched = !matched;
  return { ...base, matched, matchedValue };
}

/**
 * Check whether a condition targets an outlet field.
 */
export function isOutletCondition(condition: RuleConditionRow): boolean {
  return condition.field === "outlet" || condition.field === "outlet_list";
}
