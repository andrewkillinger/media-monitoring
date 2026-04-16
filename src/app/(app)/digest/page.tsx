"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoArticles } from "@/lib/demo-data";

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
  title: string;
  outlet: string;
  date: string;
  url: string;
}

function ArticleItem({ title, outlet, date, url }: ArticleItemProps) {
  return (
    <div className="py-2.5 border-b border-slate-100 last:border-0">
      <div className="text-xs text-slate-500 mb-0.5">
        <span className="font-semibold text-slate-700">{outlet}</span>
        {" · "}
        {formatArticleDate(date)}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-700 hover:text-blue-900 hover:underline leading-snug"
      >
        {title}
      </a>
    </div>
  );
}

export default function DigestPage() {
  const [selectedDate, setSelectedDate] = useState("2025-04-15");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied-html" | "copied-md">("idle");

  // Filter published articles for the selected date range
  // For the digest we include articles from the prior day through selected date
  const publishedArticles = useMemo(() => {
    return demoArticles.filter(
      (a) =>
        a.status === "published" &&
        !a.flagType &&
        !a.isPaywalled &&
        a.date >= "2025-04-14" &&
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
    for (const article of publishedArticles) {
      const secMap = map[article.section];
      if (!secMap) continue;
      if (article.subsection && secMap[article.subsection] !== undefined) {
        secMap[article.subsection].push(article);
      } else {
        secMap["__all__"].push(article);
      }
    }
    return map;
  }, [publishedArticles]);

  const totalArticles = publishedArticles.length;
  const displayDate = formatDisplayDate(selectedDate);

  // Build newsletter HTML string for copy
  function buildHtml(): string {
    let html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Acadia Media Monitor - ${displayDate}</title></head>
<body style="font-family:Georgia,serif;max-width:680px;margin:0 auto;padding:32px 24px;color:#1e293b;">
<div style="border-bottom:3px solid #1e40af;padding-bottom:16px;margin-bottom:24px;">
  <h1 style="font-size:22px;font-weight:700;color:#1e40af;margin:0 0 4px;">Acadia Media Monitor</h1>
  <p style="font-size:14px;color:#64748b;margin:0;">${displayDate}</p>
</div>
<p style="font-size:13px;color:#475569;margin-bottom:24px;">Coverage period: April 14–15, 2025 &nbsp;|&nbsp; ${totalArticles} items included</p>
`;

    for (const sec of DIGEST_SECTIONS) {
      const secData = articlesBySection[sec.sectionKey];
      const hasSubsections = sec.subsections !== null;

      html += `<div style="margin-bottom:28px;">
  <h2 style="font-size:15px;font-weight:700;color:#1e293b;border-bottom:1px solid #cbd5e1;padding-bottom:6px;margin-bottom:12px;">${sec.name}</h2>\n`;

      if (hasSubsections && sec.subsections) {
        let hasAny = false;
        for (const sub of sec.subsections) {
          const items = secData[sub] || [];
          if (items.length > 0) {
            hasAny = true;
            html += `  <p style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin:10px 0 6px;">${sub}</p>\n`;
            for (const a of items) {
              html += `  <div style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
    <span style="font-size:11px;color:#64748b;"><strong>${a.outlet}</strong> &middot; ${formatArticleDate(a.date)}</span><br>
    <a href="${a.url}" style="font-size:13px;color:#1e40af;">${a.title}</a>
  </div>\n`;
            }
          }
        }
        if (!hasAny) {
          html += `  <p style="font-size:13px;color:#64748b;font-style:italic;">No relevant news to report.</p>\n`;
        }
      } else {
        const items = secData["__all__"] || [];
        if (items.length > 0) {
          for (const a of items) {
            html += `  <div style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
    <span style="font-size:11px;color:#64748b;"><strong>${a.outlet}</strong> &middot; ${formatArticleDate(a.date)}</span><br>
    <a href="${a.url}" style="font-size:13px;color:#1e40af;">${a.title}</a>
  </div>\n`;
          }
        } else {
          html += `  <p style="font-size:13px;color:#64748b;font-style:italic;">No relevant news to report.</p>\n`;
        }
      }
      html += `</div>\n`;
    }

    html += `<p style="font-size:11px;color:#94a3b8;margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px;">Acadia Pharmaceuticals &mdash; Internal use only. Generated ${displayDate}.</p>
</body></html>`;
    return html;
  }

  function buildMarkdown(): string {
    let md = `# Acadia Media Monitor — ${displayDate}\n\n`;
    md += `_Coverage period: April 14–15, 2025 | ${totalArticles} items included_\n\n`;
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
              md += `**${a.outlet}** · ${formatArticleDate(a.date)}\n[${a.title}](${a.url})\n\n`;
            }
          }
        }
        if (!hasAny) md += `_No relevant news to report._\n\n`;
      } else {
        const items = secData["__all__"] || [];
        if (items.length > 0) {
          for (const a of items) {
            md += `**${a.outlet}** · ${formatArticleDate(a.date)}\n[${a.title}](${a.url})\n\n`;
          }
        } else {
          md += `_No relevant news to report._\n\n`;
        }
      }
      md += `---\n\n`;
    }
    md += `_Acadia Pharmaceuticals — Internal use only. Generated ${displayDate}._\n`;
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
          <label className="text-sm font-medium text-slate-700" htmlFor="digest-date">
            Digest date:
          </label>
          <input
            id="digest-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMd}
          >
            {copyStatus === "copied-md" ? "Copied!" : "Copy Markdown"}
          </Button>
          <Button
            size="sm"
            onClick={handleCopyHtml}
          >
            {copyStatus === "copied-html" ? "Copied!" : "Copy HTML"}
          </Button>
        </div>
      </div>

      {/* Newsletter Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Newsletter header */}
          <div className="bg-[#1e40af] px-8 py-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">
                  Internal Communications
                </p>
                <h1 className="text-2xl font-bold text-white leading-tight">
                  Acadia Media Monitor
                </h1>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm font-semibold">{displayDate}</p>
                <p className="text-blue-200 text-xs mt-0.5">Daily Digest</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
            <p className="text-xs text-slate-500">
              Coverage period:{" "}
              <span className="font-medium text-slate-700">April 14–15, 2025</span>
              {" · "}
              <span className="font-medium text-slate-700">{totalArticles} items</span> included in today&apos;s digest
              {" · "}
              Status: <span className="font-medium text-green-700">Published</span>
            </p>

            {/* Jump links */}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">Jump to:</span>
              {DIGEST_SECTIONS.map((sec) => (
                <a
                  key={sec.slug}
                  href={`#${sec.slug}`}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {sec.name}
                </a>
              ))}
            </div>
          </div>

          {/* Overview paragraph */}
          <div className="px-8 py-5 border-b border-slate-200 bg-white">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Today&apos;s digest covers {totalArticles} articles from the April 14–15, 2025 monitoring period.
              Rett Syndrome therapeutic coverage remains active with {
                (articlesBySection["Rett Syndrome"]?.["Therapeutic"] ?? []).length
              } items, including new research on MECP2 mutations and personalized treatment pathways.
              Parkinson&apos;s Disease coverage includes {
                Object.values(articlesBySection["Parkinson's Disease"] ?? {})
                  .flat().length
              } items across therapeutic and competitor subsections.
              Alzheimer&apos;s Disease features {
                (articlesBySection["Alzheimer's Disease"]?.["Therapeutic"] ?? []).length
              } item(s) on diagnostic testing attitudes.
              The News of Interest section includes {
                (articlesBySection["News of Interest"]?.["__all__"] ?? []).length
              } items covering broader healthcare and industry developments.
            </p>
          </div>

          {/* Sections */}
          <div className="divide-y divide-slate-200 bg-white">
            {DIGEST_SECTIONS.map((sec, secIdx) => {
              const secData = articlesBySection[sec.sectionKey];
              const hasSubsections = sec.subsections !== null;

              return (
                <div key={sec.slug} id={sec.slug} className="px-8 py-6">
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {secIdx + 1}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      {sec.name}
                    </h2>
                  </div>

                  {hasSubsections && sec.subsections ? (
                    <div className="space-y-4 ml-9">
                      {(() => {
                        let totalSubItems = 0;
                        sec.subsections!.forEach(sub => {
                          totalSubItems += (secData[sub] ?? []).length;
                        });
                        if (totalSubItems === 0) {
                          return (
                            <p className="text-sm text-slate-500 italic">No relevant news to report.</p>
                          );
                        }
                        return sec.subsections!.map((sub) => {
                          const items = secData[sub] ?? [];
                          return (
                            <div key={sub}>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                  {sub}
                                </h3>
                                <span className="text-xs text-slate-400">
                                  ({items.length})
                                </span>
                              </div>
                              {items.length === 0 ? (
                                <p className="text-sm text-slate-400 italic pl-1">No items.</p>
                              ) : (
                                <div className="border border-slate-100 rounded-md overflow-hidden">
                                  {items.map((article) => (
                                    <ArticleItem
                                      key={article.id}
                                      title={article.title}
                                      outlet={article.outlet}
                                      date={article.date}
                                      url={article.url}
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
                    <div className="ml-9">
                      {(secData["__all__"] ?? []).length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No relevant news to report.</p>
                      ) : (
                        <div className="border border-slate-100 rounded-md overflow-hidden">
                          {(secData["__all__"] ?? []).map((article) => (
                            <ArticleItem
                              key={article.id}
                              title={article.title}
                              outlet={article.outlet}
                              date={article.date}
                              url={article.url}
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

          {/* Newsletter footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              Acadia Pharmaceuticals &mdash; Internal use only &mdash; Not for distribution
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
