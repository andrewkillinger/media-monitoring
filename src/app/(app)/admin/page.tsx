"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { demoSchedules, demoAuditLog } from "@/lib/demo-data";

const demoUsers = [
  {
    id: "u1",
    name: "Sarah Chen",
    email: "sarah.chen@acadia.com",
    role: "admin",
    lastLogin: "2025-04-15T16:30:00Z",
    status: "active",
  },
  {
    id: "u2",
    name: "Michael Park",
    email: "michael.park@acadia.com",
    role: "editor",
    lastLogin: "2025-04-15T15:00:00Z",
    status: "active",
  },
  {
    id: "u3",
    name: "Lisa Wang",
    email: "lisa.wang@acadia.com",
    role: "reviewer",
    lastLogin: "2025-04-14T10:00:00Z",
    status: "active",
  },
];

function roleBadgeClass(role: string): string {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 border-red-200";
    case "editor":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "reviewer":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function auditActionLabel(action: string): string {
  switch (action) {
    case "article.review":
      return "Article Reviewed";
    case "flag.create":
      return "Flag Created";
    case "digest.generate":
      return "Digest Generated";
    case "rule.update":
      return "Rule Updated";
    case "article.import":
      return "Articles Imported";
    default:
      return action;
  }
}

function auditActionBadgeClass(action: string): string {
  if (action.startsWith("flag")) return "bg-red-100 text-red-700 border-red-200";
  if (action.startsWith("digest")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (action.startsWith("rule")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (action.startsWith("article")) return "bg-green-100 text-green-700 border-green-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Administration</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            User management, schedules, and system audit log
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Config
          </Button>
          <Button variant="outline" size="sm">
            Import Config
          </Button>
        </div>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">User Management</CardTitle>
              <CardDescription className="mt-0.5">
                {demoUsers.length} users with system access
              </CardDescription>
            </div>
            <Button size="sm">Invite User</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Last Login</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-sm font-medium py-3">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--muted-foreground)] py-3">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${roleBadgeClass(user.role)}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[var(--muted-foreground)] py-3">
                    {formatTimestamp(user.lastLogin)}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs text-[var(--muted-foreground)]">Active</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Schedules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scheduled Jobs</CardTitle>
          <CardDescription>
            Automated digests, reports, and ingestion schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Schedule Name</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Frequency / Cron</TableHead>
                <TableHead className="text-xs">Last Run</TableHead>
                <TableHead className="text-xs text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="text-sm font-medium py-3">
                    {schedule.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">
                      {schedule.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-[var(--muted-foreground)] py-3">
                    {schedule.cron}
                  </TableCell>
                  <TableCell className="text-xs text-[var(--muted-foreground)] py-3">
                    {schedule.lastRun ? formatTimestamp(schedule.lastRun) : (
                      <span className="italic">Not yet run</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        schedule.active ? "bg-green-500" : "bg-slate-300"
                      }`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>System audit log — last 5 events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {demoAuditLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 px-6 py-3"
              >
                <div className="shrink-0 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${auditActionBadgeClass(entry.action)}`}
                  >
                    {auditActionLabel(entry.action)}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--foreground)] truncate">
                    {entry.resource}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    by{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {entry.user}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                  {formatTimestamp(entry.date)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System info footer */}
      <Card>
        <CardContent className="py-4 px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-6">
              <span>
                Version: <span className="font-mono font-medium">1.0.0-demo</span>
              </span>
              <span>
                Environment: <span className="font-mono font-medium">demo</span>
              </span>
              <span>
                Database:{" "}
                <span className="font-mono font-medium text-amber-600">
                  Demo Mode
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7">
                Export Config
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Import Config
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
