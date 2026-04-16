"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { demoRules, demoSections } from "@/lib/demo-data";

const demoEntities = [
  { name: "Acadia Pharmaceuticals", type: "company", aliases: ["Acadia", "ACAD"], role: "primary" },
  { name: "DAYBUE", type: "product", aliases: ["trofinetide"], role: "primary" },
  { name: "NUPLAZID", type: "product", aliases: ["pimavanserin"], role: "primary" },
  { name: "Neuren Pharmaceuticals", type: "competitor", aliases: ["Neuren"], role: "competitor" },
  { name: "Biogen", type: "competitor", aliases: [], role: "competitor" },
  { name: "Bristol Myers Squibb", type: "competitor", aliases: ["BMS"], role: "competitor" },
  { name: "Amneal Pharmaceuticals", type: "competitor", aliases: ["Amneal"], role: "competitor" },
  { name: "Soleno Therapeutics", type: "competitor", aliases: ["Soleno"], role: "competitor" },
  { name: "Praxis Precision Medicine", type: "competitor", aliases: ["Praxis"], role: "competitor" },
  { name: "FDA", type: "regulator", aliases: ["U.S. FDA", "Food and Drug Administration"], role: "regulator" },
];

const demoOutlets = [
  { name: "STAT News", tier: "tier1", channel: "online", region: "US", priority: true },
  { name: "Reuters", tier: "tier1", channel: "wire", region: "Global", priority: true },
  { name: "FiercePharma", tier: "tier1", channel: "online", region: "US", priority: true },
  { name: "Endpoints News", tier: "tier1", channel: "online", region: "US", priority: true },
  { name: "The Wall Street Journal", tier: "tier1", channel: "print", region: "US", priority: true },
  { name: "CNBC", tier: "tier1", channel: "broadcast", region: "US", priority: false },
  { name: "Bloomberg", tier: "tier1", channel: "wire", region: "Global", priority: false },
  { name: "MedPage Today", tier: "trade", channel: "online", region: "US", priority: false },
  { name: "BioSpace", tier: "trade", channel: "online", region: "US", priority: false },
  { name: "Neurology Advisor", tier: "trade", channel: "online", region: "US", priority: false },
  { name: "Parkinson's Foundation", tier: "trade", channel: "online", region: "US", priority: false },
  { name: "FirstWord Pharma", tier: "trade", channel: "online", region: "US", priority: false },
];

function ruleTypeBadge(type: string) {
  switch (type) {
    case "exclusion":
      return "bg-red-100 text-red-800 border-red-200";
    case "assignment":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "alert":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function entityRoleBadge(role: string) {
  switch (role) {
    case "primary":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "competitor":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "regulator":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function tierBadge(tier: string) {
  switch (tier) {
    case "tier1":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "trade":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function RulesPage() {
  const activeSections = demoSections.filter((s) => s.active);
  const inactiveSections = demoSections.filter((s) => !s.active);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Rules & Taxonomy</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Classification rules, monitored sections, entities, and outlet configuration
        </p>
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="outlets">Outlets</TabsTrigger>
        </TabsList>

        {/* RULES TAB */}
        <TabsContent value="rules">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Classification Rules</CardTitle>
              <CardDescription>
                Rules are applied in priority order (lower number = higher priority)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-8">#</TableHead>
                    <TableHead className="text-xs">Rule Name</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Conditions</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                    <TableHead className="text-xs text-center">Priority</TableHead>
                    <TableHead className="text-xs text-center">Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoRules.map((rule, idx) => (
                    <TableRow key={rule.id}>
                      <TableCell className="text-xs text-[var(--muted-foreground)] py-3">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-sm font-medium py-3">
                        {rule.name}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${ruleTypeBadge(rule.type)}`}
                        >
                          {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-[var(--muted-foreground)] py-3 max-w-[200px]">
                        {rule.conditions}
                      </TableCell>
                      <TableCell className="text-xs text-[var(--muted-foreground)] py-3">
                        {rule.actions}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span className="text-xs font-mono bg-[var(--muted)] px-2 py-0.5 rounded">
                          {rule.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            rule.active ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECTIONS TAB */}
        <TabsContent value="sections">
          <div className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Sections</CardTitle>
                <CardDescription>
                  {activeSections.length} sections currently included in the daily digest
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[var(--border)]">
                  {activeSections.map((sec) => (
                    <div
                      key={sec.slug}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">{sec.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)] font-mono">
                          {sec.slug}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border border-green-200 bg-green-50 text-green-700"
                      >
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inactive Sections</CardTitle>
                <CardDescription>
                  {inactiveSections.length} sections available but not currently monitored
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[var(--border)]">
                  {inactiveSections.map((sec) => (
                    <div
                      key={sec.slug}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {sec.name}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)] font-mono">
                          {sec.slug}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border border-slate-200 bg-slate-50 text-slate-500"
                      >
                        Inactive
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ENTITIES TAB */}
        <TabsContent value="entities">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Monitored Entities</CardTitle>
              <CardDescription>
                Companies, products, and regulators tracked across all ingested content
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Entity Name</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Aliases</TableHead>
                    <TableHead className="text-xs text-right">Alias Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoEntities.map((entity) => (
                    <TableRow key={entity.name}>
                      <TableCell className="text-sm font-medium py-3">
                        {entity.name}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-xs font-mono text-[var(--muted-foreground)]">
                          {entity.type}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${entityRoleBadge(entity.role)}`}
                        >
                          {entity.role.charAt(0).toUpperCase() + entity.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {entity.aliases.length === 0 ? (
                            <span className="text-xs text-[var(--muted-foreground)] italic">
                              None
                            </span>
                          ) : (
                            entity.aliases.map((alias) => (
                              <span
                                key={alias}
                                className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded"
                              >
                                {alias}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3 text-sm">
                        {entity.aliases.length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OUTLETS TAB */}
        <TabsContent value="outlets">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Outlet Configuration</CardTitle>
              <CardDescription>
                Tracked outlets by tier, channel, and region
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Outlet</TableHead>
                    <TableHead className="text-xs">Tier</TableHead>
                    <TableHead className="text-xs">Channel</TableHead>
                    <TableHead className="text-xs">Region</TableHead>
                    <TableHead className="text-xs text-center">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoOutlets.map((outlet) => (
                    <TableRow key={outlet.name}>
                      <TableCell className="text-sm font-medium py-3">
                        {outlet.name}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${tierBadge(outlet.tier)}`}
                        >
                          {outlet.tier === "tier1" ? "Tier 1" : "Trade"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-[var(--muted-foreground)] py-3 capitalize">
                        {outlet.channel}
                      </TableCell>
                      <TableCell className="text-xs text-[var(--muted-foreground)] py-3">
                        {outlet.region}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        {outlet.priority ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" title="Priority outlet" />
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-slate-200" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
