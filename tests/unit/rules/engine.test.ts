import { describe, it, expect } from "vitest";
import { RuleEngine } from "@/lib/rules/engine";
import type {
  RuleWithConditionsAndActions,
  ArticleForEvaluation,
} from "@/lib/rules/types";
import type { EntityWithAliases, OutletWithTier } from "@/lib/rules/types";

function makeArticle(
  overrides: Partial<ArticleForEvaluation> = {}
): ArticleForEvaluation {
  const title = overrides.title ?? "Test article headline";
  const bodyText =
    overrides.bodyText ?? "This is the body text of the article.";
  return {
    id: "test-article-1",
    title,
    titleNormalized: title.toLowerCase(),
    bodyText,
    fullText: `${title} ${bodyText}`,
    outletName: "Reuters",
    language: "en",
    region: "US",
    mediaType: "article",
    channel: "online",
    publishedAt: new Date("2025-04-15"),
    metadata: {},
    ...overrides,
  };
}

function makeRule(
  overrides: Partial<RuleWithConditionsAndActions> = {}
): RuleWithConditionsAndActions {
  return {
    id: "rule-1",
    name: "Test Rule",
    description: null,
    priority: 100,
    is_active: true,
    rule_type: "assignment",
    match_mode: "all",
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    conditions: [],
    actions: [],
    ...overrides,
  };
}

const defaultEntities: EntityWithAliases[] = [
  {
    id: "entity-acadia",
    name: "Acadia Pharmaceuticals",
    slug: "acadia",
    entity_type: "company",
    is_primary: true,
    is_competitor: false,
    aliases: [
      { alias_text: "Acadia", is_primary: true },
      { alias_text: "Acadia Pharmaceuticals", is_primary: false },
      { alias_text: "ACAD", is_primary: false },
    ],
    disease_states: [],
  },
  {
    id: "entity-daybue",
    name: "DAYBUE",
    slug: "daybue",
    entity_type: "product",
    is_primary: true,
    is_competitor: false,
    aliases: [
      { alias_text: "DAYBUE", is_primary: true },
      { alias_text: "trofinetide", is_primary: false },
    ],
    disease_states: ["rett-syndrome"],
  },
  {
    id: "entity-neuren",
    name: "Neuren Pharmaceuticals",
    slug: "neuren",
    entity_type: "company",
    is_primary: false,
    is_competitor: true,
    aliases: [
      { alias_text: "Neuren", is_primary: true },
      { alias_text: "Neuren Pharmaceuticals", is_primary: false },
    ],
    disease_states: ["rett-syndrome", "prader-willi-syndrome"],
  },
];

const defaultOutlets: OutletWithTier[] = [
  {
    id: "outlet-reuters",
    name: "Reuters",
    slug: "reuters",
    tier: "tier1",
    channel: "wire",
    is_priority: true,
  },
  {
    id: "outlet-stat",
    name: "STAT News",
    slug: "stat-news",
    tier: "tier1",
    channel: "online",
    is_priority: true,
  },
  {
    id: "outlet-local",
    name: "Small Town Gazette",
    slug: "small-town-gazette",
    tier: "local",
    channel: "print",
    is_priority: false,
  },
];

describe("RuleEngine", () => {
  it("should instantiate without errors", () => {
    const engine = new RuleEngine({
      rules: [],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });
    expect(engine).toBeDefined();
  });

  it("should return empty classification for article with no matching rules", () => {
    const engine = new RuleEngine({
      rules: [],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });
    const result = engine.classify(makeArticle());
    expect(result.isExcluded).toBe(false);
    expect(result.assignedSections).toHaveLength(0);
    expect(result.appliedRules).toHaveLength(0);
  });

  it("should match keyword in title", () => {
    const rule = makeRule({
      id: "rule-acadia-mention",
      name: "Acadia Title Mention",
      rule_type: "assignment",
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-acadia-mention",
          field: "title",
          operator: "contains",
          value: "Acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-acadia-mention",
          action_type: "assign_section",
          target_id: "section-acadia-corporate",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const result = engine.classify(
      makeArticle({ title: "Acadia Pharmaceuticals announces new data" })
    );
    expect(result.appliedRules).toHaveLength(1);
    expect(result.assignedSections).toHaveLength(1);
    expect(result.assignedSections[0].sectionId).toBe(
      "section-acadia-corporate"
    );
  });

  it("should not match keyword that is absent", () => {
    const rule = makeRule({
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "Acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "assign_section",
          target_id: "section-1",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });
    const result = engine.classify(
      makeArticle({ title: "Parkinson's research update" })
    );
    expect(result.appliedRules).toHaveLength(0);
  });

  it("should handle exclusion rules and short-circuit", () => {
    const excludeRule = makeRule({
      id: "exclude-journals",
      name: "Exclude Journals",
      rule_type: "exclusion",
      priority: 10,
      conditions: [
        {
          id: "cond-1",
          rule_id: "exclude-journals",
          field: "outlet",
          operator: "equals",
          value: "Nature",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "exclude-journals",
          action_type: "exclude",
          target_id: null,
          target_value: "Journal publication",
          metadata: {},
          created_at: "",
        },
      ],
    });

    const includeRule = makeRule({
      id: "include-all",
      name: "Include All",
      rule_type: "assignment",
      priority: 100,
      conditions: [
        {
          id: "cond-2",
          rule_id: "include-all",
          field: "title",
          operator: "contains",
          value: "study",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-2",
          rule_id: "include-all",
          action_type: "assign_section",
          target_id: "section-1",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [includeRule, excludeRule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const result = engine.classify(
      makeArticle({
        title: "New study on Rett syndrome",
        outletName: "Nature",
      })
    );
    expect(result.isExcluded).toBe(true);
    expect(result.excludedByRule).toBe("exclude-journals");
    expect(result.assignedSections).toHaveLength(0);
  });

  it("should evaluate AND conditions (match_mode=all)", () => {
    const rule = makeRule({
      match_mode: "all",
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "Acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        {
          id: "cond-2",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "DAYBUE",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "add_tag",
          target_id: null,
          target_value: "acadia-product",
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    // Only one keyword present - should NOT match
    const result1 = engine.classify(
      makeArticle({ title: "Acadia announces results" })
    );
    expect(result1.appliedRules).toHaveLength(0);

    // Both keywords present - should match
    const result2 = engine.classify(
      makeArticle({ title: "Acadia DAYBUE trial results" })
    );
    expect(result2.appliedRules).toHaveLength(1);
    expect(result2.assignedTags).toContain("acadia-product");
  });

  it("should evaluate OR conditions (match_mode=any)", () => {
    const rule = makeRule({
      match_mode: "any",
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "Rett",
          is_negated: false,
          group_id: 0,
          group_mode: "any",
          created_at: "",
        },
        {
          id: "cond-2",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "Parkinson",
          is_negated: false,
          group_id: 0,
          group_mode: "any",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "add_tag",
          target_id: null,
          target_value: "disease-state",
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const result = engine.classify(
      makeArticle({ title: "Rett syndrome breakthrough" })
    );
    expect(result.appliedRules).toHaveLength(1);
    expect(result.assignedTags).toContain("disease-state");
  });

  it("should handle negated conditions", () => {
    const rule = makeRule({
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "Parkinson",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
        {
          id: "cond-2",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "movement disorder",
          is_negated: true,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "assign_section",
          target_id: "section-parkinsons",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    // Movement disorder in title - should NOT match (negated condition fails)
    const result1 = engine.classify(
      makeArticle({
        title: "Parkinson's movement disorder study",
      })
    );
    expect(result1.assignedSections).toHaveLength(0);

    // No movement disorder - should match
    const result2 = engine.classify(
      makeArticle({ title: "Parkinson's hallucinations treatment" })
    );
    expect(result2.assignedSections).toHaveLength(1);
  });

  it("should handle entity matching via entity matcher", () => {
    const rule = makeRule({
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "entity",
          operator: "contains",
          value: "entity-acadia",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "assign_section",
          target_id: "section-acadia",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const result = engine.classify(
      makeArticle({
        title: "Acadia Pharmaceuticals reports strong Q1",
        bodyText: "The company reported earnings above expectations.",
      })
    );
    expect(result.entityMatches.length).toBeGreaterThan(0);
    expect(
      result.entityMatches.some((e) => e.entityId === "entity-acadia")
    ).toBe(true);
  });

  it("should trigger alert actions", () => {
    const rule = makeRule({
      rule_type: "alert",
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "full_text",
          operator: "contains",
          value: "negative",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "trigger_alert",
          target_id: "alert-negative",
          target_value: "high",
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const result = engine.classify(
      makeArticle({
        title: "Concerns raised about drug safety",
        bodyText: "Negative reactions reported in trials.",
      })
    );
    expect(result.alerts).toHaveLength(1);
    expect(result.alerts[0].severity).toBe("high");
  });

  it("should classify batch of articles", () => {
    const rule = makeRule({
      conditions: [
        {
          id: "cond-1",
          rule_id: "rule-1",
          field: "title",
          operator: "contains",
          value: "Rett",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "action-1",
          rule_id: "rule-1",
          action_type: "assign_section",
          target_id: "section-rett",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [rule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const articles = [
      makeArticle({ id: "a1", title: "Rett syndrome research" }),
      makeArticle({ id: "a2", title: "Unrelated story" }),
      makeArticle({ id: "a3", title: "New Rett treatment" }),
    ];

    const results = engine.classifyBatch(articles);
    expect(results).toHaveLength(3);
    expect(results[0].assignedSections).toHaveLength(1);
    expect(results[1].assignedSections).toHaveLength(0);
    expect(results[2].assignedSections).toHaveLength(1);
  });

  it("should sort rules with exclusions first", () => {
    const assignRule = makeRule({
      id: "assign-1",
      priority: 50,
      rule_type: "assignment",
      conditions: [
        {
          id: "c1",
          rule_id: "assign-1",
          field: "title",
          operator: "contains",
          value: "pharma",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "a1",
          rule_id: "assign-1",
          action_type: "assign_section",
          target_id: "s1",
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const excludeRule = makeRule({
      id: "exclude-1",
      priority: 200,
      rule_type: "exclusion",
      conditions: [
        {
          id: "c2",
          rule_id: "exclude-1",
          field: "outlet",
          operator: "equals",
          value: "Spam Outlet",
          is_negated: false,
          group_id: 0,
          group_mode: "all",
          created_at: "",
        },
      ],
      actions: [
        {
          id: "a2",
          rule_id: "exclude-1",
          action_type: "exclude",
          target_id: null,
          target_value: null,
          metadata: {},
          created_at: "",
        },
      ],
    });

    const engine = new RuleEngine({
      rules: [assignRule, excludeRule],
      entities: defaultEntities,
      outlets: defaultOutlets,
    });

    const result = engine.classify(
      makeArticle({
        title: "New pharma deal announced",
        outletName: "Spam Outlet",
      })
    );
    expect(result.isExcluded).toBe(true);
    expect(result.assignedSections).toHaveLength(0);
  });
});
