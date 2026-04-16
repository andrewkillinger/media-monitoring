"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  demoKpis,
  demoVolumeData,
  demoSectionDistribution,
  demoTopOutlets,
  demoTopCompetitors,
} from "@/lib/demo-data";

const kpiCards = [
  { label: "Total Items", value: demoKpis.totalItems, color: "text-[var(--foreground)]" },
  { label: "Included", value: demoKpis.included, color: "text-emerald-600" },
  { label: "Flagged", value: demoKpis.flagged, color: "text-red-500" },
  { label: "Acadia Mentions", value: demoKpis.acadiaMentions, color: "text-[var(--primary)]" },
  { label: "Competitor Items", value: demoKpis.competitorItems, color: "text-amber-600" },
  { label: "Social Items", value: demoKpis.socialItems, color: "text-sky-500" },
  { label: "Broadcast Items", value: demoKpis.broadcastItems, color: "text-violet-500" },
  { label: "Pending Review", value: demoKpis.pendingReview, color: "text-orange-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Overview banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Daily Overview — April 15, 2025
            </p>
            <p className="text-sm text-[var(--foreground)]">
              <strong>{demoKpis.totalItems} items</strong> collected today.{" "}
              <strong>{demoKpis.included}</strong> included in coverage,{" "}
              <strong className="text-red-500">{demoKpis.flagged} flagged</strong> for
              immediate attention, and{" "}
              <strong className="text-orange-500">
                {demoKpis.pendingReview} pending review
              </strong>
              . Acadia received{" "}
              <strong className="text-[var(--primary)]">
                {demoKpis.acadiaMentions} mentions
              </strong>{" "}
              across tier-1 and trade outlets.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className={`text-3xl font-bold tabular-nums ${kpi.color}`}>
                {kpi.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              14-Day Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={demoVolumeData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v: string) => v.slice(5)}
                  stroke="var(--muted-foreground)"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="acadia"
                  name="Acadia"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="competitor"
                  name="Competitor"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Section distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Coverage by Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={demoSectionDistribution}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  dataKey="section"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={100}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Articles" fill="var(--primary)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top outlets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top Outlets</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                    Outlet
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="text-right py-2 font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                    Articles
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoTopOutlets.map((outlet) => (
                  <tr
                    key={outlet.name}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <td className="py-2.5 pr-4 font-medium">{outlet.name}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          outlet.tier === "tier1"
                            ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {outlet.tier === "tier1" ? "Tier 1" : "Trade"}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-semibold">
                      {outlet.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Top competitors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Top Competitor Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                    Company
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                    Disease Area
                  </th>
                  <th className="text-right py-2 font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                    Mentions
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoTopCompetitors.map((comp) => (
                  <tr
                    key={comp.name}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <td className="py-2.5 pr-4 font-medium">{comp.name}</td>
                    <td className="py-2.5 pr-4 text-[var(--muted-foreground)]">
                      {comp.disease}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-semibold text-amber-600">
                      {comp.mentions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
