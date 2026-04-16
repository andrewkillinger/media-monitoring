"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  demoArticles,
  demoKpis,
  demoVolumeData,
  demoTopOutlets,
} from "@/lib/demo-data";
import type { DemoArticle } from "@/lib/demo-data";

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = "Thursday, April 16, 2026";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function headlineFontSize(priority: number): string {
  if (priority >= 90) return "28px";
  if (priority >= 70) return "22px";
  if (priority >= 50) return "18px";
  return "15px";
}

function articleHref(article: DemoArticle): string {
  return article.isDemoUrl ? `/feed/${article.id}` : article.url;
}

function articleTarget(article: DemoArticle): string | undefined {
  return article.isDemoUrl ? undefined : "_blank";
}

function articleRel(article: DemoArticle): string | undefined {
  return article.isDemoUrl ? undefined : "noopener noreferrer";
}

// ─── Headline link ────────────────────────────────────────────────────────────

interface HeadlineLinkProps {
  article: DemoArticle;
  fontSize: string;
  lineHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

function HeadlineLink({ article, fontSize, lineHeight = 1.2, style }: HeadlineLinkProps) {
  const href = articleHref(article);
  const target = articleTarget(article);
  const rel = articleRel(article);

  const linkStyle: React.CSSProperties = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize,
    fontWeight: 700,
    lineHeight,
    color: "#0f172a",
    textDecoration: "none",
    display: "block",
    ...style,
  };

  return article.isDemoUrl ? (
    <Link href={href} style={linkStyle}>
      {article.title}
    </Link>
  ) : (
    <a href={href} target={target} rel={rel} style={linkStyle}>
      {article.title}
    </a>
  );
}

// ─── Sentiment badge ──────────────────────────────────────────────────────────

function SentimentBadge({ sentiment }: { sentiment: string }) {
  if (sentiment !== "negative") return null;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#dc2626",
        marginRight: "6px",
        verticalAlign: "middle",
      }}
    >
      ▼ Negative
    </span>
  );
}

// ─── Article meta line ────────────────────────────────────────────────────────

function ArticleMeta({ article }: { article: DemoArticle }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
        marginBottom: "5px",
      }}
    >
      <SentimentBadge sentiment={article.sentiment} />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#4F46E5",
        }}
      >
        {article.outlet}
      </span>
      <span style={{ fontSize: "11px", color: "#94a3b8" }}>·</span>
      <span style={{ fontSize: "11px", color: "#64748b" }}>{article.section}</span>
    </div>
  );
}

// ─── Hero article ─────────────────────────────────────────────────────────────

function HeroArticle({ article }: { article: DemoArticle }) {
  const isFlagged = !!article.flagType;
  return (
    <article
      style={{
        borderLeft: isFlagged ? "3px solid #f97316" : undefined,
        paddingLeft: isFlagged ? "14px" : undefined,
      }}
    >
      <ArticleMeta article={article} />
      <HeadlineLink
        article={article}
        fontSize="28px"
        lineHeight={1.15}
        style={{ marginBottom: "12px" }}
      />
      {article.summary && (
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "16px",
            lineHeight: 1.65,
            color: "#1e293b",
            margin: "0 0 10px 0",
          }}
        >
          {article.summary}
        </p>
      )}
      {isFlagged && (
        <span
          style={{
            display: "inline-block",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "#f97316",
            border: "1px solid #f97316",
            borderRadius: "3px",
            padding: "1px 6px",
            marginTop: "4px",
          }}
        >
          Flagged
        </span>
      )}
    </article>
  );
}

// ─── Secondary article ────────────────────────────────────────────────────────

function SecondaryArticle({ article }: { article: DemoArticle }) {
  const isFlagged = !!article.flagType;
  return (
    <article
      style={{
        borderLeft: isFlagged ? "3px solid #f97316" : "1px solid #e2e8f0",
        paddingLeft: "12px",
        marginBottom: "20px",
      }}
    >
      <ArticleMeta article={article} />
      <HeadlineLink
        article={article}
        fontSize={headlineFontSize(article.priority)}
        lineHeight={1.2}
        style={{ marginBottom: "6px" }}
      />
      {article.summary && (
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            lineHeight: 1.55,
            color: "#475569",
            margin: 0,
          }}
        >
          {article.summary}
        </p>
      )}
    </article>
  );
}

// ─── Small article ────────────────────────────────────────────────────────────

function SmallArticle({ article }: { article: DemoArticle }) {
  const isFlagged = !!article.flagType;
  return (
    <article
      style={{
        borderTop: "1px solid #e2e8f0",
        paddingTop: "10px",
        marginBottom: "10px",
        borderLeft: isFlagged ? "3px solid #f97316" : undefined,
        paddingLeft: isFlagged ? "10px" : undefined,
      }}
    >
      <ArticleMeta article={article} />
      <HeadlineLink
        article={article}
        fontSize="15px"
        lineHeight={1.3}
        style={{ marginBottom: "4px" }}
      />
      {article.summary && (
        <p
          style={{
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#64748b",
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {article.summary}
        </p>
      )}
    </article>
  );
}

// ─── Section column ───────────────────────────────────────────────────────────

function SectionColumn({
  sectionName,
  articles,
}: {
  sectionName: string;
  articles: DemoArticle[];
}) {
  if (articles.length === 0) return null;
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          borderTop: "2px solid #1e293b",
          paddingTop: "8px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#1e293b",
          }}
        >
          {sectionName}
        </span>
      </div>
      {articles.map((article) => (
        <SmallArticle key={article.id} article={article} />
      ))}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  flaggedCount,
  articles,
}: {
  flaggedCount: number;
  articles: DemoArticle[];
}) {
  return (
    <aside
      style={{
        width: "260px",
        flexShrink: 0,
        borderLeft: "1px solid #e2e8f0",
        paddingLeft: "20px",
      }}
    >
      {/* Flagged count */}
      <div
        style={{
          borderTop: "2px solid #f97316",
          paddingTop: "8px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#f97316",
            margin: "0 0 4px 0",
          }}
        >
          Flagged Items
        </p>
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "36px",
            fontWeight: 700,
            color: "#f97316",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {flaggedCount}
        </p>
        <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0 0" }}>
          require attention
        </p>
      </div>

      {/* KPI strip */}
      <div
        style={{
          borderTop: "2px solid #1e293b",
          paddingTop: "8px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#1e293b",
            margin: "0 0 10px 0",
          }}
        >
          Key Metrics
        </p>
        {[
          { label: "Total Articles", value: demoKpis.totalItems },
          { label: "Included", value: demoKpis.included },
          { label: "Primary Mentions", value: demoKpis.primaryMentions },
          { label: "Pending Review", value: demoKpis.pendingReview },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "6px",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#64748b" }}>{label}</span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: "#0f172a",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div
        style={{
          borderTop: "2px solid #1e293b",
          paddingTop: "8px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#1e293b",
            margin: "0 0 8px 0",
          }}
        >
          Volume — 14 Days
        </p>
        <div style={{ height: "64px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={demoVolumeData}
              margin={{ top: 2, right: 2, left: 0, bottom: 2 }}
            >
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#0f172a",
                  padding: "4px 8px",
                }}
                labelStyle={{ fontWeight: 600, fontSize: "10px" }}
                itemStyle={{ color: "#4F46E5" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#4F46E5"
                strokeWidth={1.5}
                fill="url(#sparkGrad)"
                dot={false}
                name="Total"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: "10px", color: "#94a3b8", margin: "2px 0 0 0", textAlign: "right" }}>
          daily article volume
        </p>
      </div>

      {/* Top outlets */}
      <div
        style={{
          borderTop: "2px solid #1e293b",
          paddingTop: "8px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#1e293b",
            margin: "0 0 10px 0",
          }}
        >
          Top Outlets
        </p>
        {demoTopOutlets.slice(0, 6).map((outlet) => (
          <div
            key={outlet.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "5px",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#1e293b" }}>{outlet.name}</span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#4F46E5",
                fontVariantNumeric: "tabular-nums",
                background: "#EEF2FF",
                borderRadius: "10px",
                padding: "1px 7px",
              }}
            >
              {outlet.count}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function HRule() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #cbd5e1",
        margin: "20px 0",
      }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TodaysNewsPage() {
  // Filter articles: published or reviewed, and showOnTodaysNews !== false
  const articles = useMemo(() => {
    return demoArticles
      .filter(
        (a) =>
          (a.status === "published" || a.status === "reviewed") &&
          a.showOnTodaysNews !== false
      )
      .sort((a, b) => b.priority - a.priority);
  }, []);

  // Derive summary strip counts
  const flaggedCount = articles.filter((a) => !!a.flagType).length;
  const sections = useMemo(
    () => [...new Set(articles.map((a) => a.section))],
    [articles]
  );

  // Priority tiers
  const hero = articles[0] ?? null;
  const secondaries = articles.slice(1, 4);
  const remaining = articles.slice(4);

  // Group remaining by section for section columns
  const sectionMap = useMemo(() => {
    const map = new Map<string, DemoArticle[]>();
    for (const article of remaining) {
      const existing = map.get(article.section) ?? [];
      map.set(article.section, [...existing, article]);
    }
    return map;
  }, [remaining]);

  const sectionEntries = [...sectionMap.entries()];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px 24px 64px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#ffffff",
        color: "#0f172a",
      }}
    >
      {/* ── Masthead ── */}
      <header style={{ textAlign: "center", marginBottom: "8px" }}>
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "48px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0f172a",
            margin: "0 0 4px 0",
            lineHeight: 1,
          }}
        >
          Media Monitor
        </h1>
        <div
          style={{
            borderTop: "3px solid #0f172a",
            borderBottom: "1px solid #0f172a",
            padding: "4px 0",
            margin: "8px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "12px",
              color: "#1e293b",
              letterSpacing: "0.04em",
            }}
          >
            {TODAY}
          </span>
        </div>
        {/* Summary strip */}
        <div
          style={{
            display: "inline-flex",
            gap: "20px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            padding: "5px 16px",
            marginBottom: "4px",
          }}
        >
          {[
            { label: "Items", value: articles.length },
            { label: "Flagged", value: flaggedCount },
            { label: "Sections Covered", value: sections.length },
          ].map(({ label, value }) => (
            <span key={label} style={{ fontSize: "12px", color: "#64748b" }}>
              <strong style={{ color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>
                {value}
              </strong>{" "}
              {label}
            </span>
          ))}
        </div>
      </header>

      <HRule />

      {/* ── Hero area: 3-column grid ── */}
      {hero && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 3fr 260px",
            gap: "0",
            alignItems: "start",
            marginBottom: "0",
          }}
        >
          {/* Hero */}
          <div
            style={{
              paddingRight: "28px",
              borderRight: "1px solid #cbd5e1",
            }}
          >
            <HeroArticle article={hero} />
          </div>

          {/* Secondaries */}
          <div
            style={{
              paddingLeft: "28px",
              paddingRight: "20px",
              borderRight: "1px solid #cbd5e1",
            }}
          >
            <div
              style={{
                borderTop: "2px solid #1e293b",
                paddingTop: "8px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#1e293b",
                }}
              >
                Also Today
              </span>
            </div>
            {secondaries.map((article) => (
              <SecondaryArticle key={article.id} article={article} />
            ))}
          </div>

          {/* Sidebar rail */}
          <Sidebar flaggedCount={flaggedCount} articles={articles} />
        </section>
      )}

      <HRule />

      {/* ── Section columns ── */}
      {sectionEntries.length > 0 && (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0 32px",
            }}
          >
            {sectionEntries.map(([sectionName, sectionArticles]) => (
              <SectionColumn
                key={sectionName}
                sectionName={sectionName}
                articles={sectionArticles}
              />
            ))}
          </section>
          <HRule />
        </>
      )}

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: "center",
          paddingTop: "12px",
          borderTop: "2px solid #0f172a",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "12px",
            color: "#64748b",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          Media Monitor — Coverage Summary
        </p>
      </footer>
    </div>
  );
}
