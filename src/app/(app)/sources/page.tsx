"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { demoSourceAdapters } from "@/lib/demo-data";

function formatLastFetch(ts: string | null): string {
  if (!ts) return "Never";
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function sourceTypeLabel(type: string): string {
  switch (type) {
    case "google_news":
      return "Google News";
    case "rss":
      return "RSS Feed";
    case "manual_url":
      return "Manual URL";
    case "csv_import":
      return "CSV/JSON";
    case "twitter_manual":
      return "Twitter/X";
    case "meltwater":
      return "Meltwater";
    case "factiva":
      return "Factiva";
    case "talkwalker":
      return "Talkwalker";
    case "tveyes":
      return "TV Eyes";
    default:
      return type;
  }
}

function sourceTypeBadgeClass(type: string): string {
  switch (type) {
    case "google_news":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rss":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "manual_url":
    case "csv_import":
    case "twitter_manual":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-purple-100 text-purple-700 border-purple-200";
  }
}

// Manual-input adapters - these appear in the manual import section instead of the grid
const MANUAL_TYPES = new Set(["manual_url", "csv_import", "twitter_manual"]);

interface SourceCardProps {
  adapter: (typeof demoSourceAdapters)[number];
  onRunNow: (id: string) => void;
}

function SourceCard({ adapter, onRunNow }: SourceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                  adapter.active ? "bg-green-500" : "bg-slate-300"
                }`}
              />
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                {adapter.name}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs border ${sourceTypeBadgeClass(adapter.type)}`}
            >
              {sourceTypeLabel(adapter.type)}
            </Badge>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[var(--foreground)]">
              {adapter.itemCount}
            </p>
            <p className="text-[10px] text-[var(--muted-foreground)]">items</p>
          </div>
        </div>

        <div className="text-xs text-[var(--muted-foreground)] mb-3">
          <span className="font-medium">Last fetch:</span>{" "}
          {formatLastFetch(adapter.lastFetch)}
        </div>

        {adapter.active ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              className="flex-1 text-xs h-7"
              onClick={() => onRunNow(adapter.id)}
            >
              Run Now
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
              Configure
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="w-full text-xs h-7">
            Configure & Enable
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function SourcesPage() {
  const [runningAdapters, setRunningAdapters] = useState<Set<string>>(new Set());
  const [urlInput, setUrlInput] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [twitterText, setTwitterText] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const automatedAdapters = demoSourceAdapters.filter(
    (a) => !MANUAL_TYPES.has(a.type)
  );
  const activeAdapters = automatedAdapters.filter((a) => a.active);
  const inactiveAdapters = automatedAdapters.filter((a) => !a.active);

  function handleRunNow(id: string) {
    setRunningAdapters((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setRunningAdapters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  }

  function handleUrlImport() {
    if (!urlInput.trim()) return;
    setImportSuccess("URL queued for import");
    setUrlInput("");
    setTimeout(() => setImportSuccess(null), 3000);
  }

  function handleTwitterSubmit() {
    if (!twitterHandle.trim() || !twitterText.trim()) return;
    setImportSuccess("Tweet added to queue");
    setTwitterHandle("");
    setTwitterText("");
    setTwitterUrl("");
    setTimeout(() => setImportSuccess(null), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Sources & Ingestion</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Manage data source adapters and manual content entry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-[var(--muted-foreground)]">
              {activeAdapters.length} active
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-xs text-[var(--muted-foreground)]">
              {inactiveAdapters.length} inactive
            </span>
          </div>
        </div>
      </div>

      {/* Active adapters */}
      {activeAdapters.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">
            Active Sources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAdapters.map((adapter) => (
              <SourceCard
                key={adapter.id}
                adapter={
                  runningAdapters.has(adapter.id)
                    ? { ...adapter, lastFetch: new Date().toISOString() }
                    : adapter
                }
                onRunNow={handleRunNow}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive / not-configured adapters */}
      {inactiveAdapters.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">
            Available (Not Configured)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveAdapters.map((adapter) => (
              <SourceCard
                key={adapter.id}
                adapter={adapter}
                onRunNow={handleRunNow}
              />
            ))}
          </div>
        </div>
      )}

      {/* Manual import section */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">
          Manual Import
        </h2>

        {importSuccess && (
          <div className="mb-3 px-4 py-2.5 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            {importSuccess}
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="url">
              <div className="px-6 pt-4 pb-0 border-b border-[var(--border)]">
                <TabsList className="h-9">
                  <TabsTrigger value="url" className="text-xs">URL Import</TabsTrigger>
                  <TabsTrigger value="csv" className="text-xs">CSV Upload</TabsTrigger>
                  <TabsTrigger value="twitter" className="text-xs">Twitter/X Entry</TabsTrigger>
                </TabsList>
              </div>

              {/* URL Import */}
              <TabsContent value="url">
                <div className="px-6 py-5">
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    Enter a URL to import an article directly into the ingestion pipeline.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/article"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
                    />
                    <Button onClick={handleUrlImport} disabled={!urlInput.trim()}>
                      Import
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* CSV Upload */}
              <TabsContent value="csv">
                <div className="px-6 py-5">
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    Upload a CSV or JSON file with article data. Each row should include
                    title, outlet, date, and URL fields.
                  </p>
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-sm font-medium text-[var(--foreground)] mb-1">
                      Drop a CSV or JSON file here
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mb-3">
                      Supports .csv and .json formats
                    </p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Twitter/X Entry */}
              <TabsContent value="twitter">
                <div className="px-6 py-5">
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    Manually add a tweet or social post for inclusion in coverage.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-[var(--foreground)] block mb-1">
                        Handle
                      </label>
                      <Input
                        placeholder="@username"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--foreground)] block mb-1">
                        Tweet Text
                      </label>
                      <textarea
                        placeholder="Paste tweet text here..."
                        value={twitterText}
                        onChange={(e) => setTwitterText(e.target.value)}
                        className="flex w-full rounded-[var(--radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--foreground)] block mb-1">
                        Tweet URL (optional)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://x.com/..."
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <Button
                      onClick={handleTwitterSubmit}
                      disabled={!twitterHandle.trim() || !twitterText.trim()}
                    >
                      Add to Queue
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
