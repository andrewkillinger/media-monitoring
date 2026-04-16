"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoArticles, demoSections } from "@/lib/demo-data";

// Acadia brand palette
const BLUE_SPRUCE = "#084A51";
const TURQUOISE = "#068798";
const TANGERINE = "#F56A00";
const GLACIER = "#6BC8C7";

const DIGEST_SECTIONS = [
  {
    name: "Acadia Corporate and Product News",
    slug: "acadia-corporate",
    sectionKey: "Acadia Corporate and Product News",
    subsections: null,
  },
  {
    name: "Rett Syndrome",
    slug: "rett-syndrome",
    sectionKey: "Rett Syndrome",
    subsections: ["Therapeutic", "Competitor"],
  },
  {
    name: "Parkinson's Disease",
    slug: "parkinsons-disease",
    sectionKey: "Parkinson's Disease",
    subsections: ["Therapeutic", "Competitor"],
  },
  {
    name: "Schizophrenia",
    slug: "schizophrenia",
    sectionKey: "Schizophrenia",
    subsections: null,
  },
  {
    name: "Prader-Willi Syndrome",
    slug: "prader-willi-syndrome",
    sectionKey: "Prader-Willi Syndrome",
    subsections: null,
  },
  {
    name: "Alzheimer's Disease",
    slug: "alzheimers-disease",
    sectionKey: "Alzheimer's Disease",
    subsections: ["Therapeutic", "Competitor"],
  },
  {
    name: "Fragile X Syndrome",
    slug: "fragile-x-syndrome",
    sectionKey: "Fragile X Syndrome",
    subsections: null,
  },
  {
    name: "News of Interest",
    slug: "news-of-interest",
    sectionKey: "News of Interest",
    subsections: null,
  },
];

function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}

function formatArticleDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[month - 1]}. ${day}, ${year}`;
}

interface ArticleItemProps {
  id: string;
  title: string;
  outlet: string;
  date: string;
  summary: string;
  isDemoUrl?: boolean;
}

function ArticleItem({ id, title, outlet, date, summary, isDemoUrl }: ArticleItemProps) {
  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: "#e8f4f5" }}>
      <div className="flex items-baseline gap-1.5 mb-0.5 flex-wrap">
        <span className="text-xs font-bold" style={{ color: BLUE_SPRUCE }}>
          {outlet}
        </span>
        <span className="text-xs" style={{ color: "#94a3b8" }}>
          &middot; {formatArticleDate(date)}
        </span>
      </div>
      {isDemoUrl ? (
        <Link
          href={`/feed/${id}`}
          className="text-sm font-medium leading-snug hover:underline"
          style={{ color: TURQUOISE }}
        >
          {title}
        </Link>
      ) : (
        <a
          href="#"
          className="text-sm font-medium leading-snug hover:underline"
          style={{ color: TURQUOISE }}
        >
          {title}
        </a>
      )}
      {summary && (
        <p
          className="text-xs mt-0.5 leading-relaxed line-clamp-1"
          style={{ color: "#64748b" }}
        >
          {summary}
        </p>
      )}
    </div>
  );
}

export default function DigestPage() {
  const [selectedDate, setSelectedDate] = useState("2025-04-15");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied-html" | "copied-md">("idle");

  // Filter to published or reviewed articles (exclude excluded/classified)
  const includedArticles = useMemo(() => {
    return demoArticles.filter(
      (a) =>
        (a.status === "published" || a.status === "reviewed") &&
        a.date <= selectedDate
    );
  }, [selectedDate]);

  // Group articles by section and subsection
  const articlesBySection = useMemo(() => {
    const map: Record<string, Record<string, typeof demoArticles>> = {};
    for (const sec of DIGEST_SECTIONS) {
      map[sec.sectionKey] = {};
      if (sec.subsections) {
        for (const sub of sec.subsections) {
          map[sec.sectionKey][sub] = [];
        }
        map[sec.sectionKey]["__all__"] = [];
      } else {
        map[sec.sectionKey]["__all__"] = [];
      }
    }
    for (const article of includedArticles) {
      const secMap = map[article.section];
      if (!secMap) continue;
      if (article.subsection && secMap[article.subsection] !== undefined) {
        secMap[article.subsection].push(article);
      } else {
        secMap["__all__"].push(article);
      }
    }
    return map;
  }, [includedArticles]);

  const totalArticles = includedArticles.length;
  const displayDate = formatDisplayDate(selectedDate);

  // Build newsletter HTML for copy
  function buildHtml(): string {
    let html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ACADIA MEDIA MONITOR — ${displayDate}</title></head>
<body style="font-family:Georgia,serif;max-width:680px;margin:0 auto;padding:0;color:#1e293b;">
<div style="background:${BLUE_SPRUCE};padding:28px 32px 24px;">
  <p style="font-size:11px;font-weight:700;color:${GLACIER};text-transform:uppercase;letter-spacing:0.12em;margin:0 0 6px;">Internal Communications</p>
  <h1 style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:0.04em;margin:0 0 4px;text-transform:uppercase;">ACADIA MEDIA MONITOR</h1>
  <div style="height:2px;background:${TANGERINE};margin:10px 0 12px;"></div>
  <p style="font-size:13px;color:${GLACIER};margin:0;">${displayDate} &nbsp;&middot;&nbsp; Daily Digest</p>
</div>
<div style="padding:20px 32px 16px;background:#f0f9fa;border-bottom:1px solid #cce8ea;">
  <p style="font-size:13px;color:#475569;margin:0;padding:0 0 0 12px;border-left:3px solid ${TURQUOISE};line-height:1.7;">
    Today&apos;s digest covers ${totalArticles} articles. Coverage includes Acadia corporate news, therapeutic area updates across Rett Syndrome, Parkinson&apos;s Disease, Alzheimer&apos;s Disease, and broader news of interest.
  </p>
</div>
<div style="padding:24px 32px;">
`;

    for (const sec of DIGEST_SECTIONS) {
      const secData = articlesBySection[sec.sectionKey];
      const hasSubsections = sec.subsections !== null;

      html += `<div style="margin-bottom:28px;">
  <h2 style="font-size:15px;font-weight:700;color:${BLUE_SPRUCE};border-bottom:2px solid ${TURQUOISE};padding-bottom:6px;margin-bottom:12px;text-transform:none;">${sec.name}</h2>\n`;

      if (hasSubsections && sec.subsections) {
        let hasAny = false;
        for (const sub of sec.subsections) {
          const items = secData[sub] || [];
          if (items.length > 0) {
            hasAny = true;
            html += `  <p style="font-size:10px;font-weight:700;color:${TURQUOISE};text-transform:uppercase;letter-spacing:0.1em;margin:12px 0 6px;">${sub}</p>\n`;
            for (const a of items) {
              html += `  <div style="padding:8px 0;border-bottom:1px solid #e8f4f5;">
    <span style="font-size:11px;color:#64748b;"><strong style="color:${BLUE_SPRUCE};">${a.outlet}</strong> &middot; ${formatArticleDate(a.date)}</span><br>
    <a href="/feed/${a.id}" style="font-size:13px;color:${TURQUOISE};text-decoration:none;">${a.title}</a><br>
    <span style="font-size:11px;color:#64748b;">${a.summary}</span>
  </div>\n`;
            }
          }
        }
        if (!hasAny) {
          html += `  <p style="font-size:13px;color:#94a3b8;font-style:italic;">No relevant news to report.</p>\n`;
        }
      } else {
        const items = secData["__all__"] || [];
        if (items.length > 0) {
          for (const a of items) {
            html += `  <div style="padding:8px 0;border-bottom:1px solid #e8f4f5;">
    <span style="font-size:11px;color:#64748b;"><strong style="color:${BLUE_SPRUCE};">${a.outlet}</strong> &middot; ${formatArticleDate(a.date)}</span><br>
    <a href="/feed/${a.id}" style="font-size:13px;color:${TURQUOISE};text-decoration:none;">${a.title}</a><br>
    <span style="font-size:11px;color:#64748b;">${a.summary}</span>
  </div>\n`;
          }
        } else {
          html += `  <p style="font-size:13px;color:#94a3b8;font-style:italic;">No relevant news to report.</p>\n`;
        }
      }
      html += `</div>\n`;
    }

    html += `</div>
<div style="border-top:1px solid #e2e8f0;padding:16px 32px;background:#f8fafc;">
  <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">Acadia Pharmaceuticals &mdash; Internal Use Only &mdash; Not for Distribution</p>
</div>
</body></html>`;
    return html;
  }

  function buildMarkdown(): string {
    let md = `# ACADIA MEDIA MONITOR — ${displayDate}\n\n`;
    md += `_Daily Digest | ${totalArticles} items included_\n\n`;
    md += `---\n\n`;

    for (const sec of DIGEST_SECTIONS) {
      const secData = articlesBySection[sec.sectionKey];
      const hasSubsections = sec.subsections !== null;
      md += `## ${sec.name}\n\n`;

      if (hasSubsections && sec.subsections) {
        let hasAny = false;
        for (const sub of sec.subsections) {
          const items = secData[sub] || [];
          if (items.length > 0) {
            hasAny = true;
            md += `### ${sub}\n\n`;
            for (const a of items) {
              md += `**${a.outlet}** · ${formatArticleDate(a.date)}\n`;
              md += `[${a.title}](/feed/${a.id})\n`;
              md += `${a.summary}\n\n`;
            }
          }
        }
        if (!hasAny) md += `_No relevant news to report._\n\n`;
      } else {
        const items = secData["__all__"] || [];
        if (items.length > 0) {
          for (const a of items) {
            md += `**${a.outlet}** · ${formatArticleDate(a.date)}\n`;
            md += `[${a.title}](/feed/${a.id})\n`;
            md += `${a.summary}\n\n`;
          }
        } else {
          md += `_No relevant news to report._\n\n`;
        }
      }
      md += `---\n\n`;
    }
    md += `_Acadia Pharmaceuticals — Internal Use Only. Generated ${displayDate}._\n`;
    return md;
  }

  async function handleCopyHtml() {
    await navigator.clipboard.writeText(buildHtml());
    setCopyStatus("copied-html");
    setTimeout(() => setCopyStatus("idle"), 2000);
  }

  async function handleCopyMd() {
    await navigator.clipboard.writeText(buildMarkdown());
    setCopyStatus("copied-md");
    setTimeout(() => setCopyStatus("idle"), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            className="text-sm font-medium"
            htmlFor="digest-date"
            style={{ color: BLUE_SPRUCE }}
          >
            Digest date:
          </label>
          <input
            id="digest-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "#b2d8db",
              color: "#1e293b",
              backgroundColor: "#ffffff",
            }}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMd}
            style={{
              borderColor: TURQUOISE,
              color: TURQUOISE,
            }}
          >
            {copyStatus === "copied-md" ? "Copied!" : "Copy Markdown"}
          </Button>
          <Button
            size="sm"
            onClick={handleCopyHtml}
            style={{
              backgroundColor: BLUE_SPRUCE,
              color: "#ffffff",
              border: "none",
            }}
          >
            {copyStatus === "copied-html" ? "Copied!" : "Copy HTML"}
          </Button>
        </div>
      </div>

      {/* Newsletter card */}
      <Card className="overflow-hidden shadow-sm" style={{ border: "1px solid #cce8ea" }}>
        <CardContent className="p-0">

          {/* Branded header */}
          <div style={{ backgroundColor: BLUE_SPRUCE }} className="px-8 py-6">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: GLACIER, letterSpacing: "0.12em" }}
            >
              Internal Communications
            </p>
            <h1
              className="text-2xl font-extrabold uppercase tracking-wide text-white leading-tight"
              style={{ letterSpacing: "0.04em" }}
            >
              ACADIA MEDIA MONITOR
            </h1>
            {/* Tangerine accent line */}
            <div
              style={{
                height: "2px",
                backgroundColor: TANGERINE,
                marginTop: "10px",
                marginBottom: "12px",
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: GLACIER }}>
                {displayDate}
              </p>
              <p className="text-xs" style={{ color: GLACIER, opacity: 0.8 }}>
                Daily Digest &nbsp;&middot;&nbsp; {totalArticles} items
              </p>
            </div>
          </div>

          {/* Overview box */}
          <div
            className="px-8 py-5 border-b"
            style={{ backgroundColor: "#f0f9fa", borderColor: "#cce8ea" }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: BLUE_SPRUCE }}
            >
              Overview
            </h2>
            <div
              className="pl-4 py-1 text-sm leading-relaxed"
              style={{
                borderLeft: `3px solid ${TURQUOISE}`,
                color: "#334155",
              }}
            >
              Today&apos;s digest covers{" "}
              <strong style={{ color: BLUE_SPRUCE }}>{totalArticles} articles</strong>{" "}
              across all monitored therapeutic areas and corporate news topics.
              Rett Syndrome therapeutic coverage includes{" "}
              {(articlesBySection["Rett Syndrome"]?.["Therapeutic"] ?? []).length} item(s).
              Parkinson&apos;s Disease coverage spans{" "}
              {
                Object.values(articlesBySection["Parkinson's Disease"] ?? {})
                  .flat().length
              }{" "}
              item(s) across therapeutic and competitor subsections.
              Alzheimer&apos;s Disease features{" "}
              {(articlesBySection["Alzheimer's Disease"]?.["Therapeutic"] ?? []).length} item(s)
              on diagnostic testing and therapeutic developments.
              The News of Interest section includes{" "}
              {(articlesBySection["News of Interest"]?.["__all__"] ?? []).length} items
              covering broader healthcare and industry news.
            </div>

            {/* Jump links */}
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span
                className="text-xs font-bold uppercase tracking-wide mr-1"
                style={{ color: "#94a3b8" }}
              >
                Jump to:
              </span>
              {DIGEST_SECTIONS.map((sec) => (
                <a
                  key={sec.slug}
                  href={`#${sec.slug}`}
                  className="text-xs hover:underline"
                  style={{ color: TURQUOISE }}
                >
                  {sec.name}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white divide-y" style={{ "--tw-divide-opacity": "1", borderColor: "#e8f4f5" } as React.CSSProperties}>
            {DIGEST_SECTIONS.map((sec) => {
              const secData = articlesBySection[sec.sectionKey];
              const hasSubsections = sec.subsections !== null;

              return (
                <div
                  key={sec.slug}
                  id={sec.slug}
                  className="px-8 py-6"
                  style={{ borderBottomColor: "#e8f4f5" }}
                >
                  {/* Section heading with Turquoise underline */}
                  <div className="mb-4">
                    <h2
                      className="text-base font-bold pb-2"
                      style={{
                        color: BLUE_SPRUCE,
                        borderBottom: `2px solid ${TURQUOISE}`,
                        display: "inline-block",
                        paddingRight: "48px",
                      }}
                    >
                      {sec.name}
                    </h2>
                  </div>

                  {hasSubsections && sec.subsections ? (
                    <div className="space-y-5">
                      {(() => {
                        const totalSubItems = sec.subsections!.reduce(
                          (n, sub) => n + (secData[sub] ?? []).length,
                          0
                        );
                        if (totalSubItems === 0) {
                          return (
                            <p
                              className="text-sm italic"
                              style={{ color: "#94a3b8" }}
                            >
                              No relevant news to report.
                            </p>
                          );
                        }
                        return sec.subsections!.map((sub) => {
                          const items = secData[sub] ?? [];
                          return (
                            <div key={sub}>
                              {/* Subsection heading: small Turquoise uppercase */}
                              <h3
                                className="text-xs font-bold uppercase tracking-widest mb-2"
                                style={{ color: TURQUOISE }}
                              >
                                {sub}
                                <span
                                  className="ml-2 font-normal normal-case tracking-normal"
                                  style={{ color: "#94a3b8" }}
                                >
                                  ({items.length})
                                </span>
                              </h3>
                              {items.length === 0 ? (
                                <p
                                  className="text-xs italic pl-1"
                                  style={{ color: "#cbd5e1" }}
                                >
                                  No items.
                                </p>
                              ) : (
                                <div
                                  className="rounded-md overflow-hidden border"
                                  style={{ borderColor: "#d1eef0" }}
                                >
                                  {items.map((article) => (
                                    <ArticleItem
                                      key={article.id}
                                      id={article.id}
                                      title={article.title}
                                      outlet={article.outlet}
                                      date={article.date}
                                      summary={article.summary}
                                      isDemoUrl={article.isDemoUrl}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <div>
                      {(secData["__all__"] ?? []).length === 0 ? (
                        <p
                          className="text-sm italic"
                          style={{ color: "#94a3b8" }}
                        >
                          No relevant news to report.
                        </p>
                      ) : (
                        <div
                          className="rounded-md overflow-hidden border"
                          style={{ borderColor: "#d1eef0" }}
                        >
                          {(secData["__all__"] ?? []).map((article) => (
                            <ArticleItem
                              key={article.id}
                              id={article.id}
                              title={article.title}
                              outlet={article.outlet}
                              date={article.date}
                              summary={article.summary}
                              isDemoUrl={article.isDemoUrl}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="px-8 py-4 border-t"
            style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
          >
            <p className="text-xs text-center" style={{ color: "#94a3b8" }}>
              Acadia Pharmaceuticals &mdash; Internal Use Only &mdash; Not for Distribution
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
