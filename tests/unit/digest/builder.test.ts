import { describe, it, expect } from "vitest";
import { buildDigestFromArticles } from "@/lib/digest/builder";
import type { DigestConfig } from "@/lib/digest/types";

const mockSections = [
  {
    id: "s-overview",
    name: "Overview / Summary",
    slug: "overview",
    display_order: 0,
    is_active: true,
  },
  {
    id: "s-acadia",
    name: "Acadia Corporate and Product News",
    slug: "acadia-corporate",
    display_order: 1,
    is_active: true,
  },
  {
    id: "s-rett",
    name: "Rett Syndrome",
    slug: "rett-syndrome",
    display_order: 2,
    is_active: true,
  },
  {
    id: "s-parkinsons",
    name: "Parkinson's Disease",
    slug: "parkinsons-disease",
    display_order: 3,
    is_active: true,
  },
  {
    id: "s-news",
    name: "News of Interest",
    slug: "news-of-interest",
    display_order: 8,
    is_active: true,
  },
];

const mockSubsections = [
  {
    id: "ss-rett-competitor",
    section_id: "s-rett",
    name: "Competitor",
    slug: "competitor",
    display_order: 0,
  },
  {
    id: "ss-rett-therapeutic",
    section_id: "s-rett",
    name: "Therapeutic",
    slug: "therapeutic",
    display_order: 1,
  },
  {
    id: "ss-park-competitor",
    section_id: "s-parkinsons",
    name: "Competitor",
    slug: "competitor",
    display_order: 0,
  },
  {
    id: "ss-park-therapeutic",
    section_id: "s-parkinsons",
    name: "Therapeutic",
    slug: "therapeutic",
    display_order: 1,
  },
];

const mockArticles = [
  {
    id: "a1",
    title: "Rett syndrome study highlights potential for personalized treatments",
    outlet_name: "FirstWord Pharma",
    url: "https://example.com/rett-1",
    published_at: "2025-04-15T10:00:00Z",
    section_id: "s-rett",
    subsection_id: "ss-rett-therapeutic",
    priority_score: 50,
  },
  {
    id: "a2",
    title: "Amneal Pharmaceuticals donates $2M to support Parkinson's patients",
    outlet_name: "Business NJ",
    url: "https://example.com/park-1",
    published_at: "2025-04-14T14:00:00Z",
    section_id: "s-parkinsons",
    subsection_id: "ss-park-competitor",
    priority_score: 40,
  },
  {
    id: "a3",
    title: "Novartis CEO joins Anthropic's board",
    outlet_name: "STAT News",
    url: "https://example.com/news-1",
    published_at: "2025-04-15T08:00:00Z",
    section_id: "s-news",
    subsection_id: null,
    priority_score: 30,
  },
];

describe("buildDigestFromArticles", () => {
  const config: DigestConfig = {
    date: new Date("2025-04-15"),
    includeEmptySections: true,
  };

  it("should build digest with correct sections", () => {
    const digest = buildDigestFromArticles(
      mockArticles,
      mockSections,
      mockSubsections,
      config
    );
    expect(digest.sections.length).toBe(mockSections.length);
    expect(digest.date).toEqual(new Date("2025-04-15"));
  });

  it("should place articles in correct sections", () => {
    const digest = buildDigestFromArticles(
      mockArticles,
      mockSections,
      mockSubsections,
      config
    );

    const rettSection = digest.sections.find(
      (s) => s.section.slug === "rett-syndrome"
    );
    expect(rettSection).toBeDefined();
    expect(rettSection!.hasItems).toBe(true);

    const newsSection = digest.sections.find(
      (s) => s.section.slug === "news-of-interest"
    );
    expect(newsSection).toBeDefined();
    expect(newsSection!.hasItems).toBe(true);
  });

  it("should show 'no items' for empty sections", () => {
    const digest = buildDigestFromArticles(
      mockArticles,
      mockSections,
      mockSubsections,
      config
    );

    const acadiaSection = digest.sections.find(
      (s) => s.section.slug === "acadia-corporate"
    );
    expect(acadiaSection).toBeDefined();
    expect(acadiaSection!.hasItems).toBe(false);
  });

  it("should place articles in correct subsections", () => {
    const digest = buildDigestFromArticles(
      mockArticles,
      mockSections,
      mockSubsections,
      config
    );

    const rettSection = digest.sections.find(
      (s) => s.section.slug === "rett-syndrome"
    );
    expect(rettSection!.subsections.length).toBeGreaterThan(0);

    const therapeuticSub = rettSection!.subsections.find(
      (ss) => ss.subsection?.slug === "therapeutic"
    );
    expect(therapeuticSub).toBeDefined();
    expect(therapeuticSub!.items).toHaveLength(1);
  });

  it("should exclude empty sections when includeEmptySections is false", () => {
    const digest = buildDigestFromArticles(
      mockArticles,
      mockSections,
      mockSubsections,
      { ...config, includeEmptySections: false }
    );
    expect(digest.sections.every((s) => s.hasItems)).toBe(true);
  });
});
