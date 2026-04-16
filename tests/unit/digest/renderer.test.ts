import { describe, it, expect } from "vitest";
import { renderDigestHtml, renderDigestMarkdown } from "@/lib/digest/renderer";
import type { DigestData } from "@/lib/digest/types";

const mockDigest: DigestData = {
  date: new Date("2025-04-15"),
  overview:
    "Today's coverage focuses on new Rett syndrome research and Parkinson's disease developments.",
  sections: [
    {
      section: {
        id: "s1",
        name: "Overview / Summary",
        slug: "overview",
        display_order: 0,
        is_active: true,
      },
      subsections: [],
      hasItems: false,
    },
    {
      section: {
        id: "s2",
        name: "Corporate & Product News",
        slug: "acadia-corporate",
        display_order: 1,
        is_active: true,
      },
      subsections: [],
      hasItems: false,
    },
    {
      section: {
        id: "s3",
        name: "Rett Syndrome",
        slug: "rett-syndrome",
        display_order: 2,
        is_active: true,
      },
      subsections: [
        {
          subsection: {
            id: "ss1",
            section_id: "s3",
            name: "Therapeutic",
            slug: "therapeutic",
            display_order: 1,
          },
          items: [
            {
              articleId: "a1",
              headline:
                "Rett syndrome study highlights potential for personalized treatments",
              outletName: "FirstWord Pharma",
              url: "https://example.com/rett-1",
              publishedAt: new Date("2025-04-15T10:00:00Z"),
              entityMentions: ["Rett Syndrome"],
            },
          ],
        },
      ],
      hasItems: true,
    },
    {
      section: {
        id: "s4",
        name: "News of Interest",
        slug: "news-of-interest",
        display_order: 8,
        is_active: true,
      },
      subsections: [
        {
          subsection: null,
          items: [
            {
              articleId: "a3",
              headline: "Novartis CEO joins Anthropic's board",
              outletName: "STAT News",
              url: "https://example.com/news-1",
              publishedAt: new Date("2025-04-15T08:00:00Z"),
              entityMentions: [],
            },
          ],
        },
      ],
      hasItems: true,
    },
  ],
};

describe("renderDigestHtml", () => {
  it("should render valid HTML with title", () => {
    const html = renderDigestHtml(mockDigest);
    expect(html).toContain("<html");
    expect(html).toContain("Media Monitor");
    expect(html).toContain("April 15, 2025");
  });

  it("should include overview text", () => {
    const html = renderDigestHtml(mockDigest);
    expect(html).toContain("Rett syndrome research");
  });

  it("should render section headings", () => {
    const html = renderDigestHtml(mockDigest);
    expect(html).toContain("Rett Syndrome");
    expect(html).toContain("News of Interest");
  });

  it('should show "No relevant news" for empty sections', () => {
    const html = renderDigestHtml(mockDigest);
    expect(html).toContain("No relevant news to report");
  });

  it("should render article links", () => {
    const html = renderDigestHtml(mockDigest);
    expect(html).toContain("https://example.com/rett-1");
    expect(html).toContain("personalized treatments");
    expect(html).toContain("FirstWord Pharma");
  });

  it("should render subsection headings", () => {
    const html = renderDigestHtml(mockDigest);
    expect(html).toContain("Therapeutic");
  });
});

describe("renderDigestMarkdown", () => {
  it("should render Markdown with title", () => {
    const md = renderDigestMarkdown(mockDigest);
    expect(md).toContain("# Media Monitor");
  });

  it("should render section headings as h2", () => {
    const md = renderDigestMarkdown(mockDigest);
    expect(md).toContain("## Rett Syndrome");
    expect(md).toContain("## News of Interest");
  });

  it('should show "No relevant news" for empty sections', () => {
    const md = renderDigestMarkdown(mockDigest);
    expect(md).toContain("No relevant news to report");
  });

  it("should render articles as links", () => {
    const md = renderDigestMarkdown(mockDigest);
    expect(md).toContain("[personalized treatments]");
    expect(md).toContain("FirstWord Pharma");
  });
});
