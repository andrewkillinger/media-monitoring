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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  demoKpis,
  demoTopOutlets,
  demoSectionDistribution,
} from "@/lib/demo-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Monthly volume data for Q1 2025
const monthlyData = [
  { month: "Jan", total: 112, acadia: 18, competitor: 28, social: 6 },
  { month: "Feb", total: 98, acadia: 14, competitor: 22, social: 5 },
  { month: "Mar", total: 134, acadia: 23, competitor: 35, social: 9 },
];

const kpiCards = [
  {
    label: "Total Articles (Q1)",
    value: (monthlyData.reduce((s, m) => s + m.total, 0)).toString(),
    sub: "Across all monitored sections",
    color: "text-[var(--foreground)]",
  },
  {
    label: "Acadia Mentions",
    value: (monthlyData.reduce((s, m) => s + m.acadia, 0)).toString(),
    sub: "Corporate & product coverage",
    color: "text-blue-600",
  },
  {
    label: "Competitor Items",
    value: (monthlyData.reduce((s, m) => s + m.competitor, 0)).toString(),
    sub: "Competitor activity tracked",
    color: "text-amber-600",
  },
  {
    label: "Flagged Items",
    value: "21",
    sub: "Requiring editorial attention",
    color: "text-red-500",
  },
];

function tierBadgeClass(tier: string): string {
  switch (tier) {
    case "tier1":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "trade":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function tierLabel(tier: string): string {
  switch (tier) {
    case "tier1":
      return "Tier 1";
    case "trade":
      return "Trade";
    default:
      return tier;
  }
}

export default function ReportsPage() {
  const [exportStatus, setExportStatus] = useState<"idle" | "csv" | "html">("idle");

  function handleExport(format: "csv" | "html") {
    setExportStatus(format);
    setTimeout(() => setExportStatus("idle"), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Reports</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Periodic coverage analysis and trend summaries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
          >
            {exportStatus === "csv" ? "Exported!" : "Export CSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("html")}
          >
            {exportStatus === "html" ? "Exported!" : "Export HTML"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="quarterly">
        <TabsList>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="annual">Annual</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* QUARTERLY TAB */}
        <TabsContent value="quarterly">
          <div className="space-y-5 mt-4">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((kpi) => (
                <Card key={kpi.label}>
                  <CardContent className="p-5">
                    <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-sm font-medium text-[var(--foreground)] mt-1">
                      {kpi.label}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {kpi.sub}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Volume chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Volume — Q1 2025</CardTitle>
                <CardDescription>Article counts by category per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="total" name="Total" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="acadia" name="Acadia" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="competitor" name="Competitor" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="social" name="Social" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top outlets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Outlets</CardTitle>
                  <CardDescription>By article count, Q1 2025</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Outlet</TableHead>
                        <TableHead className="text-xs">Tier</TableHead>
                        <TableHead className="text-xs text-right">Articles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoTopOutlets.map((outlet, idx) => (
                        <TableRow key={outlet.name}>
                          <TableCell className="text-sm py-2.5">
                            <span className="text-xs text-[var(--muted-foreground)] mr-2">
                              {idx + 1}.
                            </span>
                            {outlet.name}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-xs border ${tierBadgeClass(outlet.tier)}`}
                            >
                              {tierLabel(outlet.tier)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-right py-2.5 font-medium">
                            {outlet.count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Section breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Section Breakdown</CardTitle>
                  <CardDescription>Distribution by coverage area</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Section</TableHead>
                        <TableHead className="text-xs text-right">Count</TableHead>
                        <TableHead className="text-xs text-right">Share</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const total = demoSectionDistribution.reduce(
                          (s, r) => s + r.count,
                          0
                        );
                        return demoSectionDistribution.map((row) => (
                          <TableRow key={row.section}>
                            <TableCell className="text-sm py-2.5">{row.section}</TableCell>
                            <TableCell className="text-sm text-right py-2.5 font-medium">
                              {row.count}
                            </TableCell>
                            <TableCell className="text-sm text-right py-2.5 text-[var(--muted-foreground)]">
                              {Math.round((row.count / total) * 100)}%
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ANNUAL TAB */}
        <TabsContent value="annual">
          <div className="mt-4">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-[var(--muted-foreground)] text-sm">
                  Annual report data will be available at end of year (December 31, 2025).
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  View Prior Year (2024)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CUSTOM TAB */}
        <TabsContent value="custom">
          <div className="mt-4">
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-[var(--muted-foreground)] text-sm mb-4">
                  Select a custom date range to generate a tailored report.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">From:</label>
                    <input
                      type="date"
                      defaultValue="2025-01-01"
                      className="h-9 rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">To:</label>
                    <input
                      type="date"
                      defaultValue="2025-04-15"
                      className="h-9 rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <Button size="sm">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
