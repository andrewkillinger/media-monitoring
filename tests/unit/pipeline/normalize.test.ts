import { describe, it, expect } from "vitest";
import {
  normalizeTitle,
  normalizeUrl,
  extractSnippet,
} from "@/lib/pipeline/normalize";

describe("normalize", () => {
  describe("normalizeTitle", () => {
    it("should lowercase and trim", () => {
      expect(normalizeTitle("  Hello World  ")).toBe("hello world");
    });

    it("should collapse whitespace", () => {
      expect(normalizeTitle("Hello   World")).toBe("hello world");
    });

    it("should handle empty string", () => {
      expect(normalizeTitle("")).toBe("");
    });
  });

  describe("normalizeUrl", () => {
    it("should remove common tracking parameters", () => {
      const url =
        "https://example.com/article?utm_source=twitter&utm_medium=social&id=123";
      const normalized = normalizeUrl(url);
      expect(normalized).toContain("id=123");
      expect(normalized).not.toContain("utm_source");
      expect(normalized).not.toContain("utm_medium");
    });

    it("should remove trailing slashes", () => {
      expect(normalizeUrl("https://example.com/article/")).toBe(
        "https://example.com/article"
      );
    });

    it("should handle URLs without query params", () => {
      expect(normalizeUrl("https://example.com/article")).toBe(
        "https://example.com/article"
      );
    });

    it("should lowercase the hostname", () => {
      expect(normalizeUrl("https://EXAMPLE.COM/Article")).toBe(
        "https://example.com/Article"
      );
    });
  });

  describe("extractSnippet", () => {
    it("should extract first N characters", () => {
      const text = "This is a long article body that goes on and on.";
      expect(extractSnippet(text, 20)).toBe("This is a long artic...");
    });

    it("should return full text if shorter than max", () => {
      expect(extractSnippet("Short text", 100)).toBe("Short text");
    });

    it("should handle empty string", () => {
      expect(extractSnippet("", 100)).toBe("");
    });
  });
});
