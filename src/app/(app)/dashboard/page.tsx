"use client";

import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { demoArticles, demoKpis, demoVolumeData, demoTopOutlets } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// ─── Data preparation ─────────────────────────────────────────────────────────

const visibleArticles = demoArticles
  .filter((a) => a.status === "published" || a.status === "reviewed")
  .sort((a, b) => b.priority - a.priority);

const heroArticle = visibleArticles[0];
const secondaryArticles = visibleArticles.slice(1, 4);
const remainingArticles = visibleArticles.slice(4);

// Group remaining articles by section
const sectionMap = new Map<string, typeof remainingArticles>();
for (const article of remainingArticles) {
  const key = article.section;
  if (!sectionMap.has(key)) sectionMap.set(key, []);
  sectionMap.get(key)!.push(article);
}
const sectionEntries = Array.from(sectionMap.entries());

// ─── Helpers ──────────────────────────────────────────────────────────────────

function articleHref(id: string) {
  return `/feed/${id}`;
}

function SectionTag({ label, section }: { label: string; section: string }) {
  const isAcadia = section.toLowerCase().includes("acadia");
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "9px",
        fontFamily: "Roboto, system-ui, sans-serif",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "2px 5px",
        border: isAcadia ? "1px solid #068798" : "1px solid #9ca3af",
        color: isAcadia ? "#068798" : "#6b7280",
        lineHeight: 1.5,
        verticalAlign: "middle",
      }}
    >
      {label}
    </span>
  );
}

function OutletByline({
  outlet,
  date,
  channel,
}: {
  outlet: string;
  date: string;
  channel?: string;
}) {
  const formatted =
    date
      ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : null;
  return (
    <p
      style={{
        fontFamily: "Roboto, system-ui, sans-serif",
        fontSize: "10px",
        color: "#6b7280",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: "#374151", fontWeight: 600 }}>{outlet}</span>
      {channel && channel !== "online" && (
        <span style={{ color: "#9ca3af" }}> · {channel}</span>
      )}
      {formatted && (
        <span style={{ color: "#9ca3af" }}> · {formatted}</span>
      )}
    </p>
  );
}

// Thin 1 px rule — newspaper column divider
const THIN_RULE = (
  <hr
    style={{
      border: "none",
      borderTop: "1px solid #cbd5e0",
      margin: 0,
    }}
  />
);

// Heavy top border used under masthead and between major zones
const THICK_RULE = (
  <hr
    style={{
      border: "none",
      borderTop: "3px solid #032930",
      margin: 0,
    }}
  />
);

// ─── Hero Story ───────────────────────────────────────────────────────────────

function HeroStory() {
  if (!heroArticle) return null;
  const isFlagged = !!heroArticle.flagType;
  const isNegative = heroArticle.sentiment === "negative";

  return (
    <article
      style={{
        borderLeft: isFlagged ? "4px solid #F56A00" : undefined,
        paddingLeft: isFlagged ? "16px" : undefined,
      }}
    >
      {/* Metadata row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <SectionTag label={heroArticle.section} section={heroArticle.section} />
        {isFlagged && (
          <span
            style={{
              fontSize: "9px",
              fontFamily: "Roboto, system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#F56A00",
            }}
          >
            &#9679; Flagged
          </span>
        )}
        {heroArticle.isPaywalled && (
          <span
            style={{
              fontSize: "9px",
              fontFamily: "Roboto, system-ui, sans-serif",
              color: "#9ca3af",
              letterSpacing: "0.05em",
            }}
          >
            [Paywall]
          </span>
        )}
      </div>

      {/* Headline */}
      <Link href={articleHref(heroArticle.id)} style={{ textDecoration: "none", color: "inherit" }}>
        <h2
          className={cn("hero-headline")}
          style={{
            fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1.18,
            color: "#032930",
            margin: "0 0 12px 0",
            letterSpacing: "-0.015em",
          }}
        >
          {heroArticle.title}
        </h2>
      </Link>

      <OutletByline
        outlet={heroArticle.outlet}
        date={heroArticle.date}
        channel={heroArticle.channel}
      />

      {/* Lede */}
      <p
        style={{
          fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
          fontSize: "15px",
          lineHeight: 1.75,
          color: isNegative ? "#4a2020" : "#1a202c",
          margin: "12px 0 0 0",
        }}
      >
        {heroArticle.summary}
      </p>

      {isNegative && (
        <p
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "10px",
            color: "#9b2c2c",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "10px 0 0 0",
          }}
        >
          &#9660; Negative Sentiment
        </p>
      )}
    </article>
  );
}

// ─── Secondary Story ──────────────────────────────────────────────────────────

function SecondaryStory({
  article,
  dividerTop = true,
}: {
  article: (typeof visibleArticles)[0];
  dividerTop?: boolean;
}) {
  const isFlagged = !!article.flagType;
  const isNegative = article.sentiment === "negative";

  return (
    <article
      style={{
        paddingTop: dividerTop ? "14px" : undefined,
        borderTop: dividerTop ? "1px solid #cbd5e0" : undefined,
        borderLeft: isFlagged ? "3px solid #F56A00" : undefined,
        paddingLeft: isFlagged ? "10px" : undefined,
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "6px",
        }}
      >
        <SectionTag label={article.section} section={article.section} />
        {isFlagged && (
          <span style={{ fontSize: "9px", color: "#F56A00", fontWeight: 700 }}>
            &#9679;
          </span>
        )}
      </div>

      <Link href={articleHref(article.id)} style={{ textDecoration: "none", color: "inherit" }}>
        <h3
          style={{
            fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.22,
            color: "#032930",
            margin: "0 0 8px 0",
          }}
        >
          {article.title}
        </h3>
      </Link>

      <OutletByline outlet={article.outlet} date={article.date} channel={article.channel} />

      <p
        style={{
          fontFamily: "Roboto, system-ui, sans-serif",
          fontSize: "13px",
          lineHeight: 1.6,
          color: isNegative ? "#4a2020" : "#374151",
          margin: "8px 0 0 0",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.summary}
      </p>
    </article>
  );
}

// ─── Section Column Article ───────────────────────────────────────────────────

function SectionArticle({ article }: { article: (typeof visibleArticles)[0] }) {
  const isNegative = article.sentiment === "negative";
  const isFlagged = !!article.flagType;

  return (
    <div
      style={{
        marginBottom: "13px",
        paddingBottom: "13px",
        borderBottom: "1px solid #e9ecef",
        borderLeft: isFlagged ? "3px solid #F56A00" : undefined,
        paddingLeft: isFlagged ? "9px" : undefined,
      }}
    >
      <Link href={articleHref(article.id)} style={{ textDecoration: "none" }}>
        <p
          style={{
            fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#032930",
            margin: "0 0 4px 0",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#068798";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#032930";
          }}
        >
          {article.title}
        </p>
      </Link>

      <p
        style={{
          fontFamily: "Roboto, system-ui, sans-serif",
          fontSize: "10px",
          color: "#6b7280",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
          margin: "0 0 4px 0",
        }}
      >
        {article.outlet}
        {article.isPaywalled && (
          <span style={{ color: "#9ca3af", fontWeight: 400 }}> [Paywall]</span>
        )}
      </p>

      <p
        style={{
          fontFamily: "Roboto, system-ui, sans-serif",
          fontSize: "12px",
          lineHeight: 1.55,
          color: isNegative ? "#7f1d1d" : "#4b5563",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.summary}
      </p>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function VolumeSparkline() {
  return (
    <div style={{ height: "58px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={demoVolumeData}
          margin={{ top: 2, right: 0, left: 0, bottom: 2 }}
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#068798" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#068798" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              background: "#032930",
              border: "none",
              borderRadius: "2px",
              fontSize: "11px",
              color: "#fff",
              padding: "4px 8px",
            }}
            itemStyle={{ color: "#6BC8C7" }}
            labelStyle={{ color: "#9ca3af", fontSize: "10px" }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#068798"
            strokeWidth={1.5}
            fill="url(#sparkGrad)"
            dot={false}
            name="Total"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  const flaggedCount = visibleArticles.filter((a) => a.flagType).length;

  return (
    <aside
      style={{
        width: "260px",
        flexShrink: 0,
        borderLeft: "1px solid #cbd5e0",
        paddingLeft: "22px",
      }}
    >
      {/* Flagged Items — appears first if flagged items exist */}
      {flaggedCount > 0 && (
        <div style={{ marginBottom: "22px" }}>
          <h4
            style={{
              fontFamily: "Roboto, system-ui, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#F56A00",
              margin: "0 0 5px 0",
            }}
          >
            Flagged Items
          </h4>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid #F56A00",
              margin: "0 0 10px 0",
            }}
          />
          <div
            style={{
              padding: "10px 12px",
              borderLeft: "3px solid #F56A00",
              background: "#fff8f3",
            }}
          >
            <p
              style={{
                fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
                fontSize: "32px",
                fontWeight: 700,
                color: "#9a3412",
                margin: 0,
                lineHeight: 1,
              }}
            >
              {flaggedCount}
            </p>
            <p
              style={{
                fontFamily: "Roboto, system-ui, sans-serif",
                fontSize: "11px",
                color: "#b45309",
                margin: "4px 0 0 0",
              }}
            >
              {flaggedCount === 1 ? "item requires" : "items require"} immediate attention
            </p>
          </div>
        </div>
      )}

      {/* By the Numbers */}
      <div style={{ marginBottom: "22px" }}>
        <h4
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#084A51",
            margin: "0 0 5px 0",
          }}
        >
          By the Numbers
        </h4>
        <hr
          style={{
            border: "none",
            borderTop: "2px solid #084A51",
            margin: "0 0 10px 0",
          }}
        />
        <div>
          {[
            { label: "Total Items", value: demoKpis.totalItems, emphasis: false },
            { label: "Included", value: demoKpis.included, emphasis: false },
            { label: "Acadia Mentions", value: demoKpis.acadiaMentions, emphasis: true },
            { label: "Competitor Items", value: demoKpis.competitorItems, emphasis: false },
            { label: "Social Items", value: demoKpis.socialItems, emphasis: false },
            { label: "Broadcast", value: demoKpis.broadcastItems, emphasis: false },
            { label: "Pending Review", value: demoKpis.pendingReview, emphasis: false },
          ].map(({ label, value, emphasis }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "5px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span
                style={{
                  fontFamily: "Roboto, system-ui, sans-serif",
                  fontSize: "12px",
                  color: "#4b5563",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "Roboto, system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: emphasis ? "#084A51" : "#032930",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.01em",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 14-Day Volume Sparkline */}
      <div style={{ marginBottom: "22px" }}>
        <h4
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#084A51",
            margin: "0 0 5px 0",
          }}
        >
          14-Day Volume
        </h4>
        <hr
          style={{
            border: "none",
            borderTop: "2px solid #084A51",
            margin: "0 0 10px 0",
          }}
        />
        <VolumeSparkline />
        <p
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "10px",
            color: "#9ca3af",
            margin: "4px 0 0 0",
            textAlign: "right",
          }}
        >
          Apr 2 — Apr 15
        </p>
      </div>

      {/* Top Outlets */}
      <div>
        <h4
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#084A51",
            margin: "0 0 5px 0",
          }}
        >
          Top Outlets
        </h4>
        <hr
          style={{
            border: "none",
            borderTop: "2px solid #084A51",
            margin: "0 0 10px 0",
          }}
        />
        <div>
          {demoTopOutlets.slice(0, 6).map((outlet, idx) => (
            <div
              key={outlet.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "5px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span
                style={{
                  fontFamily: "Roboto, system-ui, sans-serif",
                  fontSize: "12px",
                  color: idx < 3 ? "#032930" : "#6b7280",
                  fontWeight: idx < 3 ? 600 : 400,
                }}
              >
                {outlet.name}
              </span>
              <span
                style={{
                  fontFamily: "Roboto, system-ui, sans-serif",
                  fontSize: "12px",
                  color: "#9ca3af",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {outlet.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const flaggedCount = visibleArticles.filter((a) => a.flagType).length;
  const acadiaMentions = visibleArticles.filter((a) =>
    a.entities.some((e) => e.toLowerCase().includes("acadia"))
  ).length;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px 56px",
        background: "#ffffff",
        fontFamily: "Roboto, system-ui, sans-serif",
      }}
    >
      {/* ════════════════════════════════════════════════════════════
          MASTHEAD
          ════════════════════════════════════════════════════════════ */}
      <header style={{ textAlign: "center", padding: "30px 0 0" }}>
        {/* Eyebrow dateline */}
        <p
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6b7280",
            margin: "0 0 8px 0",
          }}
        >
          Tuesday, April 15, 2025
        </p>

        {/* Nameplate */}
        <h1
          style={{
            fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
            fontSize: "48px",
            fontWeight: 700,
            color: "#084A51",
            margin: 0,
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}
        >
          Acadia Media Monitor
        </h1>

        {/* Double rule — classic broadsheet masthead separator */}
        <div style={{ margin: "12px 0 0" }}>
          <hr
            style={{
              border: "none",
              borderTop: "3px solid #084A51",
              margin: "0 0 3px",
            }}
          />
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #084A51",
              margin: 0,
            }}
          />
        </div>

        {/* Summary strip */}
        <p
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "12px",
            color: "#4b5563",
            margin: "8px 0 14px",
            letterSpacing: "0.03em",
          }}
        >
          Today:{" "}
          <strong style={{ color: "#032930" }}>
            {demoKpis.totalItems} items
          </strong>{" "}
          monitored
          {" · "}
          <strong style={{ color: "#F56A00" }}>{flaggedCount} flagged</strong>
          {" · "}
          <strong style={{ color: "#084A51" }}>
            {acadiaMentions} Acadia mentions
          </strong>
        </p>
      </header>

      {/* Heavy rule below masthead, above content */}
      {THICK_RULE}

      {/* ════════════════════════════════════════════════════════════
          ABOVE-THE-FOLD: HERO  +  SECONDARIES  +  SIDEBAR
          Layout: [Hero 5fr] [Secondaries 3fr] [Sidebar ~260px]
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "5fr 3fr 260px",
          gap: "0",
          marginTop: "26px",
        }}
      >
        {/* ── Hero column ── */}
        <div
          style={{
            paddingRight: "28px",
            borderRight: "1px solid #cbd5e0",
          }}
        >
          <HeroStory />
        </div>

        {/* ── Secondary stories column ── */}
        <div
          style={{
            paddingLeft: "28px",
            paddingRight: "28px",
            borderRight: "1px solid #cbd5e0",
          }}
        >
          {secondaryArticles.map((article, idx) => (
            <SecondaryStory
              key={article.id}
              article={article}
              dividerTop={idx > 0}
            />
          ))}
        </div>

        {/* ── Sidebar column ── */}
        <Sidebar />
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION BREAK
          ════════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: "28px" }}>{THICK_RULE}</div>

      {/* ════════════════════════════════════════════════════════════
          SECTION COLUMNS — newspaper multi-column layout
          ════════════════════════════════════════════════════════════ */}
      {sectionEntries.length > 0 && (
        <section style={{ marginTop: "26px" }}>
          <div
            style={{
              columns: "3 340px",
              columnGap: "0",
            }}
          >
            {sectionEntries.map(([sectionName, articles], sectionIdx) => (
              <div
                key={sectionName}
                style={{
                  breakInside: "avoid-column",
                  pageBreakInside: "avoid",
                  marginBottom: "26px",
                  paddingLeft: sectionIdx > 0 ? "24px" : "0",
                  paddingRight: "24px",
                  borderLeft:
                    sectionIdx > 0 ? "1px solid #cbd5e0" : undefined,
                }}
              >
                {/* Section heading */}
                <div style={{ marginBottom: "11px" }}>
                  <h3
                    style={{
                      fontFamily: "Roboto, system-ui, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#084A51",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {sectionName}
                  </h3>
                  <hr
                    style={{
                      border: "none",
                      borderTop: "2px solid #084A51",
                      margin: 0,
                    }}
                  />
                </div>

                {/* Articles within section */}
                {articles.map((article) => (
                  <SectionArticle key={article.id} article={article} />
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          FOOTER RULE
          ════════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: "36px" }}>
        {THICK_RULE}
        <p
          style={{
            fontFamily: "Roboto, system-ui, sans-serif",
            fontSize: "10px",
            color: "#9ca3af",
            margin: "8px 0 0",
            textAlign: "center",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Acadia Pharmaceuticals · Media Monitoring · Confidential
        </p>
      </div>
    </div>
  );
}
