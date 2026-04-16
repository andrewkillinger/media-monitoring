import { describe, it, expect } from "vitest";
import { KeywordMatcher } from "@/lib/rules/matchers/keyword.matcher";
import type { EvaluationContext } from "@/lib/rules/types";

function makeContext(
  overrides: Partial<EvaluationContext["article"]> = {}
): EvaluationContext {
  const title = overrides.title ?? "Test headline about Acadia";
  const bodyText =
    overrides.bodyText ??
    "This article discusses Acadia Pharmaceuticals and their pipeline.";
  return {
    article: {
      id: "test",
      title,
      titleNormalized: title.toLowerCase(),
      bodyText,
      fullText: `${title} ${bodyText}`,
      outletName: "Reuters",
      language: "en",
      region: "US",
      mediaType: "article",
      channel: "online",
      publishedAt: new Date(),
      metadata: {},
      ...overrides,
    },
    entityMatches: [],
    outletInfo: null,
    resolvedTags: [],
  };
}

describe("KeywordMatcher", () => {
  describe("contains operator", () => {
    it("should match keyword in specified field", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "contains",
          value: "Acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(true);
    });

    it("should be case-insensitive", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "contains",
          value: "acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(true);
    });

    it("should not match when keyword is absent", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "contains",
          value: "Biogen",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(false);
    });

    it("should search full_text field (title + body)", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "full_text",
          operator: "contains",
          value: "pipeline",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(true);
    });
  });

  describe("not_contains operator", () => {
    it("should return true when keyword is absent", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "not_contains",
          value: "Biogen",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(true);
    });

    it("should return false when keyword is present", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "not_contains",
          value: "Acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(false);
    });
  });

  describe("matches_regex operator", () => {
    it("should match regex pattern", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "matches_regex",
          value: "Acad[ia]+",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(true);
    });

    it("should handle invalid regex gracefully", () => {
      const matcher = new KeywordMatcher();
      const result = matcher.evaluate(
        {
          id: "c1",
          rule_id: "r1",
          field: "title",
          operator: "matches_regex",
          value: "[invalid",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        makeContext()
      );
      expect(result).toBe(false);
    });
  });
});
