import { describe, it, expect } from "vitest";
import { isSimilarTitle, normalizeForDedup } from "@/lib/pipeline/dedup";

describe("dedup", () => {
  describe("normalizeForDedup", () => {
    it("should lowercase and strip extra whitespace", () => {
      expect(normalizeForDedup("  Hello   World  ")).toBe("hello world");
    });

    it("should remove common URL tracking suffixes", () => {
      expect(normalizeForDedup("Article Title | Reuters")).toBe(
        "article title"
      );
    });

    it("should handle empty string", () => {
      expect(normalizeForDedup("")).toBe("");
    });
  });

  describe("isSimilarTitle", () => {
    it("should detect identical titles", () => {
      expect(
        isSimilarTitle(
          "Acadia Pharmaceuticals announces new data",
          "Acadia Pharmaceuticals announces new data"
        )
      ).toBe(true);
    });

    it("should detect near-identical titles with minor differences", () => {
      expect(
        isSimilarTitle(
          "Acadia Pharmaceuticals announces new data for DAYBUE",
          "Acadia Pharmaceuticals announces new data for DAYBUE (trofinetide)"
        )
      ).toBe(true);
    });

    it("should detect syndicated copies with outlet suffix", () => {
      expect(
        isSimilarTitle(
          "FDA approves new treatment for Rett syndrome",
          "FDA approves new treatment for Rett syndrome | Reuters"
        )
      ).toBe(true);
    });

    it("should reject clearly different titles", () => {
      expect(
        isSimilarTitle(
          "Acadia Pharmaceuticals announces new data",
          "Parkinson's disease research shows breakthrough"
        )
      ).toBe(false);
    });

    it("should handle case insensitivity", () => {
      expect(
        isSimilarTitle(
          "ACADIA Reports Strong Quarter",
          "Acadia reports strong quarter"
        )
      ).toBe(true);
    });

    it("should respect custom threshold", () => {
      expect(
        isSimilarTitle("Some article title here", "Some article title", 0.9)
      ).toBe(false);

      expect(
        isSimilarTitle("Some article title here", "Some article title", 0.5)
      ).toBe(true);
    });
  });
});
