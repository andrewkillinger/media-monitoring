"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectItem } from "@/components/ui/select";
import { demoFlags } from "@/lib/demo-data";

type FlagStatus = "active" | "reviewing" | "resolved" | "all";
type FlagSeverity = "all" | "critical" | "high" | "medium" | "low";

function severityBadgeClass(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "reviewing":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "sent":
      return "bg-green-100 text-green-800 border-green-200";
    case "resolved":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function flagTypeLabel(type: string): string {
  switch (type) {
    case "negative_product":
      return "Negative Product";
    case "competitor_milestone":
      return "Competitor Milestone";
    case "acadia_earned":
      return "Acadia Earned Media";
    default:
      return type.replace(/_/g, " ");
  }
}

interface FlagCardProps {
  flag: (typeof demoFlags)[number];
  onMarkReviewing: (id: string) => void;
  onResolve: (id: string) => void;
}

function FlagCard({ flag, onMarkReviewing, onResolve }: FlagCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-0">
          {/* Severity stripe */}
          <div
            className={`w-1.5 self-stretch shrink-0 ${
              flag.severity === "critical"
                ? "bg-red-500"
                : flag.severity === "high"
                ? "bg-orange-400"
                : flag.severity === "medium"
                ? "bg-yellow-400"
                : "bg-blue-400"
            }`}
          />
          <div className="flex-1 p-4">
            {/* Top row: badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                className={`text-xs border ${severityBadgeClass(flag.severity)}`}
                variant="outline"
              >
                {flag.severity.toUpperCase()}
              </Badge>
              <Badge
                className="text-xs border border-slate-200 bg-slate-100 text-slate-600"
                variant="outline"
              >
                {flagTypeLabel(flag.type)}
              </Badge>
              <Badge
                className={`text-xs border ${statusBadgeClass(flag.status)}`}
                variant="outline"
              >
                {flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
              </Badge>
              {flag.holdFromNewsletter && (
                <Badge
                  className="text-xs border border-red-200 bg-red-50 text-red-700"
                  variant="outline"
                >
                  Hold from Newsletter
                </Badge>
              )}
            </div>

            {/* Headline */}
            <p className="text-sm font-semibold text-slate-900 leading-snug mb-1">
              {flag.headline}
            </p>

            {/* Outlet + date */}
            <p className="text-xs text-slate-500 mb-2">
              <span className="font-medium text-slate-700">{flag.outlet}</span>
              {" · "}
              {flag.date}
            </p>

            {/* Notes */}
            {flag.notes && (
              <p className="text-xs text-slate-600 bg-slate-50 rounded p-2 border border-slate-100 mb-3">
                {flag.notes}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {flag.status !== "reviewing" && flag.status !== "resolved" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => onMarkReviewing(flag.id)}
                >
                  Mark Reviewing
                </Button>
              )}
              {flag.status !== "resolved" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() => onResolve(flag.id)}
                >
                  Resolve
                </Button>
              )}
              {flag.status === "resolved" && (
                <span className="text-xs text-slate-400 italic">Resolved</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AlertsPage() {
  const [flags, setFlags] = useState(demoFlags);
  const [severityFilter, setSeverityFilter] = useState<FlagSeverity>("all");

  function handleMarkReviewing(id: string) {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "reviewing" as const } : f))
    );
  }

  function handleResolve(id: string) {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "resolved" as const } : f))
    );
  }

  function filterFlags(tabStatus: FlagStatus) {
    return flags.filter((f) => {
      const matchesTab =
        tabStatus === "all" ||
        (tabStatus === "active" && f.status !== "reviewing" && f.status !== "resolved" && f.status !== "sent") ||
        (tabStatus === "reviewing" && f.status === "reviewing") ||
        (tabStatus === "resolved" && (f.status === "resolved" || f.status === "sent")) ||
        tabStatus === "all";
      const matchesSeverity =
        severityFilter === "all" || f.severity === severityFilter;
      return matchesTab && matchesSeverity;
    });
  }

  const activeCount = flags.filter(
    (f) => f.status !== "reviewing" && f.status !== "resolved" && f.status !== "sent"
  ).length;
  const reviewingCount = flags.filter((f) => f.status === "reviewing").length;
  const resolvedCount = flags.filter(
    (f) => f.status === "resolved" || f.status === "sent"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Alerts & Flags</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Items flagged for editorial attention or immediate review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--muted-foreground)]">
            Severity:
          </label>
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as FlagSeverity)}
            className="h-8 w-36 text-xs"
          >
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </Select>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active", value: activeCount, color: "text-red-600" },
          { label: "Reviewing", value: reviewingCount, color: "text-amber-600" },
          { label: "Resolved / Sent", value: resolvedCount, color: "text-green-600" },
          { label: "Total", value: flags.length, color: "text-[var(--foreground)]" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="active">
            Active{activeCount > 0 && <span className="ml-1.5 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">{activeCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Reviewing{reviewingCount > 0 && <span className="ml-1.5 rounded-full bg-amber-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">{reviewingCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {(["active", "reviewing", "resolved", "all"] as FlagStatus[]).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-3 mt-3">
              {filterFlags(tab).length === 0 ? (
                <div className="text-center py-12 text-[var(--muted-foreground)] text-sm">
                  No flags in this category.
                </div>
              ) : (
                filterFlags(tab).map((flag) => (
                  <FlagCard
                    key={flag.id}
                    flag={flag}
                    onMarkReviewing={handleMarkReviewing}
                    onResolve={handleResolve}
                  />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
