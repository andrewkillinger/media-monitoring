"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  demoKpis,
  demoVolumeData,
  demoSectionDistribution,
  demoTopOutlets,
  demoTopCompetitors,
} from "@/lib/demo-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type DateRangePreset = "today" | "7d" | "14d" | "30d" | "90d" | "custom";
type OutletSortKey = "name" | "count";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: number;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  accent?: boolean;
}

function KpiCard({ title, value, trend, trendLabel, accent }: KpiCardProps) {
  const trendIcon =
    trend === "up" ? "▲" : trend === "down" ? "▼" : null;
  const trendColor =
    trend === "up"
      ? "#16a34a"
      : trend === "down"
      ? "#dc2626"
      : "var(--muted-foreground)";

  return (
    <Card
      style={{
        borderLeft: accent ? "4px solid #dc2626" : undefined,
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
          }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          style={{
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: 1,
            color: accent ? "#dc2626" : "var(--foreground)",
            fontVariantNumeric: "tabular-nums",
            margin: "0 0 6px 0",
          }}
        >
          {value}
        </p>
        {trendIcon && trendLabel && (
          <p
            style={{
              fontSize: "12px",
              color: trendColor,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <span>{trendIcon}</span>
            <span>{trendLabel}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Date range selector ──────────────────────────────────────────────────────

interface DateRangeSelectorProps {
  activePreset: DateRangePreset;
  customFrom: string;
  customTo: string;
  onPreset: (preset: DateRangePreset) => void;
  onCustomFrom: (v: string) => void;
  onCustomTo: (v: string) => void;
}

// Preset buttons: Today, 7 Days, 30 Days, 90 Days, Custom.
// 14 days is the default state value but has no button.
const PRESETS: { key: DateRangePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

function DateRangeSelector({
  activePreset,
  customFrom,
  customTo,
  onPreset,
  onCustomFrom,
  onCustomTo,
}: DateRangeSelectorProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {PRESETS.map(({ key, label }) => (
        <Button
          key={key}
          size="sm"
          variant={activePreset === key ? "default" : "outline"}
          onClick={() => onPreset(key)}
          style={
            activePreset === key
              ? { background: "#4F46E5", color: "#fff", borderColor: "#4F46E5" }
              : undefined
          }
        >
          {label}
        </Button>
      ))}
      <Button
        size="sm"
        variant={activePreset === "custom" ? "default" : "outline"}
        onClick={() => onPreset("custom")}
        style={
          activePreset === "custom"
            ? { background: "#4F46E5", color: "#fff", borderColor: "#4F46E5" }
            : undefined
        }
      >
        Custom
      </Button>
      {activePreset === "custom" && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFrom(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "var(--radius-md, 6px)",
              border: "1px solid var(--border)",
              fontSize: "13px",
              background: "var(--background)",
              color: "var(--foreground)",
            }}
          />
          <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
            to
          </span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomTo(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "var(--radius-md, 6px)",
              border: "1px solid var(--border)",
              fontSize: "13px",
              background: "var(--background)",
              color: "var(--foreground)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Selected day banner ──────────────────────────────────────────────────────

interface SelectedDayBannerProps {
  day: (typeof demoVolumeData)[0] | null;
  onClear: () => void;
}

function SelectedDayBanner({ day, onClear }: SelectedDayBannerProps) {
  if (!day) return null;
  return (
    <div
      style={{
        padding: "10px 16px",
        background: "#EEF2FF",
        border: "1px solid #C7D2FE",
        borderRadius: "var(--radius-md, 6px)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#4F46E5" }}>
        {day.date}
      </span>
      <span style={{ fontSize: "13px", color: "#3730A3" }}>
        Total: <strong>{day.total}</strong>
      </span>
      <span style={{ fontSize: "13px", color: "#3730A3" }}>
        Primary Mentions: <strong>{day.primary}</strong>
      </span>
      <span style={{ fontSize: "13px", color: "#3730A3" }}>
        Competitor: <strong>{day.competitor}</strong>
      </span>
      <button
        onClick={onClear}
        style={{
          marginLeft: "auto",
          background: "transparent",
          border: "none",
          color: "#6366F1",
          cursor: "pointer",
          fontSize: "13px",
          padding: "0",
        }}
      >
        Clear ✕
      </button>
    </div>
  );
}

// ─── Top Outlets table ────────────────────────────────────────────────────────

function OutletsTable() {
  const [sortKey, setSortKey] = useState<OutletSortKey>("count");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...demoTopOutlets].sort((a, b) => {
      const av = sortKey === "count" ? a.count : a.name;
      const bv = sortKey === "count" ? b.count : b.name;
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortAsc]);

  function handleSort(key: OutletSortKey) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
  }

  const tierLabel: Record<string, string> = {
    tier1: "Tier 1",
    trade: "Trade",
  };

  function SortIcon({ col }: { col: OutletSortKey }) {
    if (sortKey !== col)
      return <span style={{ color: "var(--muted-foreground)" }}> ⇅</span>;
    return <span style={{ color: "#4F46E5" }}>{sortAsc ? " ▲" : " ▼"}</span>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
          <th
            style={{
              padding: "8px 0",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
              color: "var(--foreground)",
            }}
            onClick={() => handleSort("name")}
          >
            Outlet
            <SortIcon col="name" />
          </th>
          <th
            style={{
              padding: "8px 0",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
              textAlign: "right",
              color: "var(--foreground)",
            }}
            onClick={() => handleSort("count")}
          >
            Articles
            <SortIcon col="count" />
          </th>
          <th
            style={{
              padding: "8px 0",
              fontWeight: 600,
              color: "var(--foreground)",
              paddingLeft: "16px",
            }}
          >
            Tier
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((outlet, idx) => (
          <tr
            key={outlet.name}
            style={{
              borderBottom: "1px solid var(--border)",
              background: idx % 2 === 0 ? "transparent" : "var(--muted)",
            }}
          >
            <td style={{ padding: "9px 0", color: "var(--foreground)" }}>
              {outlet.name}
            </td>
            <td
              style={{
                padding: "9px 0",
                textAlign: "right",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: "#4F46E5",
              }}
            >
              {outlet.count}
            </td>
            <td style={{ padding: "9px 0", paddingLeft: "16px" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 7px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background:
                    outlet.tier === "tier1" ? "#EEF2FF" : "var(--muted)",
                  color:
                    outlet.tier === "tier1" ? "#4F46E5" : "var(--muted-foreground)",
                }}
              >
                {tierLabel[outlet.tier] ?? outlet.tier}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Top Entities / Competitors table ─────────────────────────────────────────

function CompetitorsTable() {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
          <th style={{ padding: "8px 0", fontWeight: 600, color: "var(--foreground)" }}>
            Entity
          </th>
          <th
            style={{
              padding: "8px 0",
              fontWeight: 600,
              textAlign: "right",
              color: "var(--foreground)",
            }}
          >
            Mentions
          </th>
          <th
            style={{
              padding: "8px 0",
              fontWeight: 600,
              paddingLeft: "16px",
              color: "var(--foreground)",
            }}
          >
            Area
          </th>
        </tr>
      </thead>
      <tbody>
        {demoTopCompetitors.map((comp, idx) => (
          <tr
            key={comp.name}
            style={{
              borderBottom: "1px solid var(--border)",
              background: idx % 2 === 0 ? "transparent" : "var(--muted)",
            }}
          >
            <td style={{ padding: "9px 0", color: "var(--foreground)" }}>
              {comp.name}
            </td>
            <td
              style={{
                padding: "9px 0",
                textAlign: "right",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: "#4F46E5",
              }}
            >
              {comp.mentions}
            </td>
            <td
              style={{
                padding: "9px 0",
                paddingLeft: "16px",
                color: "var(--muted-foreground)",
                fontSize: "12px",
              }}
            >
              {comp.disease}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // Date range state — default 14 days (no button; just the initial state)
  const [activePreset, setActivePreset] = useState<DateRangePreset>("14d");
  const [customFrom, setCustomFrom] = useState("2026-03-17");
  const [customTo, setCustomTo] = useState("2026-04-16");

  // Selected day from volume chart click
  const [selectedDay, setSelectedDay] = useState<
    (typeof demoVolumeData)[0] | null
  >(null);

  function handlePreset(preset: DateRangePreset) {
    setActivePreset(preset);
    if (preset !== "custom") setSelectedDay(null);
  }

  // KPI cards
  const kpis: KpiCardProps[] = [
    {
      title: "Total Articles",
      value: demoKpis.totalItems,
      trend: "up",
      trendLabel: "+12% vs prior period",
    },
    {
      title: "Sections Covered",
      value: demoSectionDistribution.length,
      trend: "neutral",
    },
    {
      title: "Flagged Items",
      value: demoKpis.flagged,
      trend: "down",
      trendLabel: "-2 vs prior period",
      accent: true,
    },
    {
      title: "Pending Review",
      value: demoKpis.pendingReview,
      trend: "neutral",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "32px 24px 64px",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: "0 0 4px 0",
              letterSpacing: "-0.015em",
            }}
          >
            Analytics Dashboard
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Media volume, coverage trends, and key metrics
          </p>
        </div>

        {/* Date range selector */}
        <DateRangeSelector
          activePreset={activePreset}
          customFrom={customFrom}
          customTo={customTo}
          onPreset={handlePreset}
          onCustomFrom={setCustomFrom}
          onCustomTo={setCustomTo}
        />
      </div>

      {/* ── KPI cards — 4-col row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* ── Volume trends chart — full width ── */}
      <Card style={{ marginBottom: "28px" }}>
        <CardHeader>
          <CardTitle
            style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}
          >
            Volume Trends
          </CardTitle>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "2px 0 0 0" }}>
            Daily article counts — click a data point to drill down
          </p>
        </CardHeader>
        <CardContent>
          <SelectedDayBanner
            day={selectedDay}
            onClear={() => setSelectedDay(null)}
          />
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={demoVolumeData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                onClick={(payload: Record<string, unknown> | null) => {
                  const ap = (payload as { activePayload?: { payload: (typeof demoVolumeData)[0] }[] })?.activePayload;
                  if (ap && ap.length > 0) {
                    setSelectedDay(ap[0].payload);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#64748b" } as Record<string, unknown>}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={
                    {
                      fontSize: 11,
                      fill: "var(--muted-foreground)",
                    } as Record<string, unknown>
                  }
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    marginBottom: "4px",
                    color: "var(--foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#4F46E5", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="primary"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#059669", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  name="Primary Mentions"
                />
                <Line
                  type="monotone"
                  dataKey="competitor"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: "#F59E0B", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  name="Competitor"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Chart legend */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "12px",
              justifyContent: "center",
            }}
          >
            {[
              { color: "#4F46E5", label: "Total", dash: false },
              { color: "#059669", label: "Primary Mentions", dash: false },
              { color: "#F59E0B", label: "Competitor", dash: true },
            ].map(({ color, label, dash }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <svg width="20" height="10">
                  <line
                    x1="0"
                    y1="5"
                    x2="20"
                    y2="5"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={dash ? "4 2" : undefined}
                  />
                </svg>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Lower grid: section distribution + tables (2-col) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Section distribution — horizontal BarChart */}
        <Card>
          <CardHeader>
            <CardTitle
              style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}
            >
              Section Distribution
            </CardTitle>
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                margin: "2px 0 0 0",
              }}
            >
              Articles per section — click a bar to explore
            </p>
          </CardHeader>
          <CardContent>
            <div style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demoSectionDistribution}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  onClick={(payload: Record<string, unknown> | null) => {
                    const ap = (payload as { activePayload?: { payload: (typeof demoSectionDistribution)[0] }[] })?.activePayload;
                    if (ap && ap.length > 0) {
                      console.log("Section clicked:", ap[0].payload.section, ap[0].payload.count);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={
                      {
                        fontSize: 11,
                        fill: "var(--muted-foreground)",
                      } as Record<string, unknown>
                    }
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="section"
                    width={100}
                    tick={
                      {
                        fontSize: 11,
                        fill: "var(--muted-foreground)",
                      } as Record<string, unknown>
                    }
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                    cursor={{ fill: "rgba(79,70,229,0.06)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#4F46E5"
                    radius={[0, 3, 3, 0]}
                    name="Articles"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right column: two tables stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top Outlets */}
          <Card style={{ flex: 1 }}>
            <CardHeader>
              <CardTitle
                style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}
              >
                Top Outlets
              </CardTitle>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                  margin: "2px 0 0 0",
                }}
              >
                Click column headers to sort
              </p>
            </CardHeader>
            <CardContent>
              <OutletsTable />
            </CardContent>
          </Card>

          {/* Top Entities / Competitors */}
          <Card style={{ flex: 1 }}>
            <CardHeader>
              <CardTitle
                style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}
              >
                Top Entities / Competitors
              </CardTitle>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                  margin: "2px 0 0 0",
                }}
              >
                By mention count in period
              </p>
            </CardHeader>
            <CardContent>
              <CompetitorsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
