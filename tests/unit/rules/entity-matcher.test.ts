import { describe, it, expect } from "vitest";
import { EntityIndex } from "@/lib/rules/matchers/entity.matcher";
import type { EntityWithAliases } from "@/lib/rules/types";

const testEntities: EntityWithAliases[] = [
  {
    id: "e-acadia",
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
    id: "e-daybue",
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
    id: "e-biogen",
    name: "Biogen",
    slug: "biogen",
    entity_type: "company",
    is_primary: false,
    is_competitor: true,
    aliases: [
      { alias_text: "Biogen", is_primary: true },
      { alias_text: "Aduhelm", is_primary: false },
      { alias_text: "Aduhlem", is_primary: false },
      { alias_text: "aducanumab", is_primary: false },
    ],
    disease_states: ["alzheimers-disease"],
  },
  {
    id: "e-minerva",
    name: "Minerva Neurosciences",
    slug: "minerva",
    entity_type: "company",
    is_primary: false,
    is_competitor: true,
    aliases: [
      { alias_text: "Minerva", is_primary: true },
      { alias_text: "Minerva Neurosciences", is_primary: false },
      { alias_text: "Minvera", is_primary: false },
    ],
    disease_states: ["parkinsons-disease", "schizophrenia"],
  },
];

describe("EntityIndex", () => {
  it("should create index from entities", () => {
    const index = new EntityIndex(testEntities);
    expect(index).toBeDefined();
  });

  it("should find exact entity name match in title", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Acadia Pharmaceuticals reports Q1 earnings",
      bodyText: "The company exceeded expectations.",
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((m) => m.entityId === "e-acadia")).toBe(true);
  });

  it("should find alias match", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "ACAD stock rises on news",
      bodyText: "",
    });
    expect(matches.some((m) => m.entityId === "e-acadia")).toBe(true);
  });

  it("should find product match", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "DAYBUE shows promise in new study",
      bodyText: "Trofinetide data presented at conference.",
    });
    expect(matches.some((m) => m.entityId === "e-daybue")).toBe(true);
  });

  it("should find typo alias match (Aduhlem for Aduhelm)", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Aduhlem sales data released",
      bodyText: "",
    });
    expect(matches.some((m) => m.entityId === "e-biogen")).toBe(true);
  });

  it("should find typo alias match (Minvera for Minerva)", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Minvera Neurosciences announces results",
      bodyText: "",
    });
    expect(matches.some((m) => m.entityId === "e-minerva")).toBe(true);
  });

  it("should detect match location (title, body, both)", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Acadia announces new trial",
      bodyText: "Acadia Pharmaceuticals will begin enrollment.",
    });
    const acadiaMatch = matches.find((m) => m.entityId === "e-acadia");
    expect(acadiaMatch).toBeDefined();
    expect(acadiaMatch!.matchLocation).toBe("both");
  });

  it("should match body only", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "New drug trial announced",
      bodyText: "The trial by Biogen will start next month.",
    });
    const biogenMatch = matches.find((m) => m.entityId === "e-biogen");
    expect(biogenMatch).toBeDefined();
    expect(biogenMatch!.matchLocation).toBe("body");
  });

  it("should not match partial words", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Academy awards announced",
      bodyText: "",
    });
    expect(matches.some((m) => m.entityId === "e-acadia")).toBe(false);
  });

  it("should return empty for no matches", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Weather forecast for tomorrow",
      bodyText: "Sunny skies expected.",
    });
    expect(matches).toHaveLength(0);
  });

  it("should deduplicate matches for same entity", () => {
    const index = new EntityIndex(testEntities);
    const matches = index.findMatches({
      title: "Acadia Pharmaceuticals",
      bodyText: "ACAD reported that Acadia will expand.",
    });
    const acadiaMatches = matches.filter((m) => m.entityId === "e-acadia");
    expect(acadiaMatches).toHaveLength(1);
  });
});
