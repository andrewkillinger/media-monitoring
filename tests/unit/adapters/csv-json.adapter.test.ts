import { describe, it, expect } from "vitest";
import { CsvJsonAdapter } from "@/lib/adapters/csv-json.adapter";

describe("CsvJsonAdapter", () => {
  const adapter = new CsvJsonAdapter();

  it("should have correct type and display name", () => {
    expect(adapter.type).toBe("csv_import");
    expect(adapter.displayName).toBe("CSV/JSON Import");
  });

  it("should parse JSON array input", async () => {
    const config = {
      id: "test",
      type: "csv_import" as const,
      name: "Test Import",
      settings: {
        format: "json",
        data: JSON.stringify([
          {
            url: "https://example.com/1",
            title: "Article One",
            outlet: "Reuters",
            published_at: "2025-04-15",
          },
          {
            url: "https://example.com/2",
            title: "Article Two",
            outlet: "STAT News",
            published_at: "2025-04-14",
          },
        ]),
      },
      isActive: true,
    };

    const result = await adapter.fetch(config);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].url).toBe("https://example.com/1");
    expect(result.items[0].title).toBe("Article One");
    expect(result.items[0].outletName).toBe("Reuters");
    expect(result.items[1].title).toBe("Article Two");
  });

  it("should parse CSV input", async () => {
    const csvData = `url,title,outlet,published_at
https://example.com/1,Article One,Reuters,2025-04-15
https://example.com/2,Article Two,STAT News,2025-04-14`;

    const config = {
      id: "test",
      type: "csv_import" as const,
      name: "Test CSV Import",
      settings: {
        format: "csv",
        data: csvData,
      },
      isActive: true,
    };

    const result = await adapter.fetch(config);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].url).toBe("https://example.com/1");
    expect(result.items[0].title).toBe("Article One");
  });

  it("should handle empty JSON array", async () => {
    const config = {
      id: "test",
      type: "csv_import" as const,
      name: "Test",
      settings: { format: "json", data: "[]" },
      isActive: true,
    };

    const result = await adapter.fetch(config);
    expect(result.items).toHaveLength(0);
  });
});
