import { describe, it, expect, vi } from "vitest";
import { RssAdapter } from "@/lib/adapters/rss.adapter";

describe("RssAdapter", () => {
  it("should have correct type and display name", () => {
    const adapter = new RssAdapter();
    expect(adapter.type).toBe("rss");
    expect(adapter.displayName).toBe("RSS Feed");
  });

  it("should validate config with valid feed URL", async () => {
    const adapter = new RssAdapter();
    const result = await adapter.validate({
      id: "test",
      type: "rss",
      name: "Test RSS",
      settings: { feedUrl: "https://example.com/rss.xml" },
      isActive: true,
    });
    expect(result.valid).toBe(true);
  });

  it("should reject config with missing feed URL", async () => {
    const adapter = new RssAdapter();
    const result = await adapter.validate({
      id: "test",
      type: "rss",
      name: "Test RSS",
      settings: {},
      isActive: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it("should reject config with invalid URL", async () => {
    const adapter = new RssAdapter();
    const result = await adapter.validate({
      id: "test",
      type: "rss",
      name: "Test RSS",
      settings: { feedUrl: "not-a-url" },
      isActive: true,
    });
    expect(result.valid).toBe(false);
  });
});
