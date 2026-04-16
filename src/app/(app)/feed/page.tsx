"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { demoArticles, demoSections, type DemoArticle } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  EyeOff,
  Plus,
  Search,
} from "lucide-react";

// ─── colour maps ─────────────────────────────────────────────────────────────

const channelColors: Record<string, string> = {
  online: "bg-sky-100 text-sky-700 border-sky-200",
  social: "bg-violet-100 text-violet-700 border-violet-200",
  print: "bg-amber-100 text-amber-700 border-amber-200",
  broadcast: "bg-orange-100 text-orange-700 border-orange-200",
  wire: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusColors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  reviewed: "bg-blue-100 text-blue-700 border-blue-200",
  classified: "bg-purple-100 text-purple-700 border-purple-200",
  excluded: "bg-red-100 text-red-700 border-red-200",
};

// ─── badge helpers ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        statusColors[status] ?? "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      {status}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        channelColors[channel] ?? "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      {channel}
    </span>
  );
}

const priorityColor = (p: number) => {
  if (p >= 80) return "text-red-600 font-bold";
  if (p >= 60) return "text-amber-600 font-semibold";
  return "text-[var(--muted-foreground)]";
};

// ─── custom global filter — searches title, outlet, and summary ───────────────

const articleSearchFilter: FilterFn<DemoArticle> = (row, _columnId, value) => {
  const q = String(value).toLowerCase().trim();
  if (!q) return true;
  const { title, outlet, summary } = row.original;
  return (
    title.toLowerCase().includes(q) ||
    (outlet ?? "").toLowerCase().includes(q) ||
    (summary ?? "").toLowerCase().includes(q)
  );
};
articleSearchFilter.autoRemove = (val) => !val || String(val).trim() === "";

// ─── "Add Coverage" dialog ────────────────────────────────────────────────────

interface AddCoverageFormData {
  url: string;
  title: string;
  outlet: string;
  section: string;
  date: string;
  priority: number;
}

const TODAY = new Date().toISOString().slice(0, 10);

function AddCoverageDialog({
  onAdd,
}: {
  onAdd: (article: DemoArticle) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddCoverageFormData>({
    url: "",
    title: "",
    outlet: "",
    section: demoSections[0]?.name ?? "",
    date: TODAY,
    priority: 50,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newArticle: DemoArticle = {
      id: `manual-${Date.now()}`,
      title: form.title,
      summary: "",
      outlet: form.outlet,
      section: form.section,
      subsection: null,
      date: form.date,
      status: "published",
      channel: "online",
      region: "US",
      language: "en",
      url: form.url || "#",
      priority: Math.min(100, Math.max(0, form.priority)),
      entities: [],
      sentiment: "neutral",
      showOnTodaysNews: true,
    };
    onAdd(newArticle);
    setOpen(false);
    setForm({
      url: "",
      title: "",
      outlet: "",
      section: demoSections[0]?.name ?? "",
      date: TODAY,
      priority: 50,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors",
          "h-9 px-3",
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
        )}
      >
        <Plus className="h-4 w-4" />
        Add Coverage
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Coverage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">
              URL
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Headline <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="Article headline"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Outlet <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Reuters"
              value={form.outlet}
              onChange={(e) =>
                setForm((f) => ({ ...f, outlet: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Section
            </label>
            <Select
              value={form.section}
              onChange={(e) =>
                setForm((f) => ({ ...f, section: e.target.value }))
              }
            >
              {demoSections.map((s) => (
                <SelectItem key={s.slug} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Priority (0–100)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm">
              Add Article
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── column helper (created outside component — stable reference) ──────────────

const columnHelper = createColumnHelper<DemoArticle>();

// ─── page component ───────────────────────────────────────────────────────────

export default function FeedPage() {
  // Mutable article list (supports add, priority change, toggle)
  const [articles, setArticles] = useState<DemoArticle[]>(() =>
    demoArticles.map((a) => ({
      ...a,
      showOnTodaysNews:
        a.showOnTodaysNews !== undefined
          ? a.showOnTodaysNews
          : a.status === "published" || a.status === "reviewed",
    }))
  );

  // Filter / sort state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Inline mutation handlers
  function handleToggleNews(id: string) {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, showOnTodaysNews: !a.showOnTodaysNews } : a
      )
    );
  }

  function handlePriorityChange(id: string, delta: number) {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, priority: Math.min(100, Math.max(0, a.priority + delta)) }
          : a
      )
    );
  }

  function handleAddArticle(article: DemoArticle) {
    setArticles((prev) => [article, ...prev]);
  }

  // Pre-filter by channel / status before handing to TanStack
  const filteredData = useMemo(
    () =>
      articles.filter((a) => {
        if (channelFilter !== "all" && a.channel !== channelFilter) return false;
        if (statusFilter !== "all" && a.status !== statusFilter) return false;
        return true;
      }),
    [articles, channelFilter, statusFilter]
  );

  // Column definitions — closures capture the setter-based handlers (safe across renders)
  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor("outlet", {
        header: "Outlet",
        cell: (info) => (
          <span className="text-xs font-medium whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
        size: 160,
      }),
      columnHelper.accessor("channel", {
        header: "Channel",
        cell: (info) => <ChannelBadge channel={info.getValue()} />,
        size: 90,
      }),
      columnHelper.accessor("title", {
        header: "Headline",
        cell: (info) => (
          <Link
            href={`/feed/${info.row.original.id}`}
            className="text-sm text-[var(--primary)] hover:underline line-clamp-2 leading-snug"
          >
            {info.getValue()}
          </Link>
        ),
        size: 360,
      }),
      columnHelper.accessor("section", {
        header: "Section",
        cell: (info) => (
          <span className="text-xs text-[var(--muted-foreground)]">
            {info.getValue()}
          </span>
        ),
        size: 160,
      }),
      // Priority with up / down controls
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: (info) => {
          const id = info.row.original.id;
          const val = info.getValue();
          return (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm tabular-nums w-6 text-right",
                  priorityColor(val)
                )}
              >
                {val}
              </span>
              <div className="flex flex-col">
                <button
                  aria-label="Increase priority"
                  onClick={() => handlePriorityChange(id, 10)}
                  disabled={val >= 100}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  aria-label="Decrease priority"
                  onClick={() => handlePriorityChange(id, -10)}
                  disabled={val <= 0}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        },
        size: 90,
      }),
      // Show on Today's News toggle
      columnHelper.accessor("showOnTodaysNews", {
        id: "showOnTodaysNews",
        header: "News",
        cell: (info) => {
          const id = info.row.original.id;
          const shown = info.getValue() ?? false;
          return (
            <button
              aria-label={
                shown ? "Hide from Today's News" : "Show on Today's News"
              }
              onClick={() => handleToggleNews(id)}
              className={cn(
                "rounded p-1 transition-colors",
                shown
                  ? "text-[var(--primary)] hover:bg-[var(--accent)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              )}
            >
              {shown ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          );
        },
        size: 60,
        enableSorting: false,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
        size: 100,
      }),
    ],
    // handlePriorityChange and handleToggleNews use functional setState — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: articleSearchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const channels = ["all", "online", "social", "print", "broadcast", "wire"];
  const statuses = ["all", "published", "reviewed", "classified", "excluded"];

  const totalVisible = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search headlines, outlets, summaries..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 w-72 text-sm pl-8"
          />
        </div>
        <Select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="h-9 w-36 text-sm"
        >
          {channels.map((c) => (
            <SelectItem key={c} value={c}>
              {c === "all"
                ? "All Channels"
                : c.charAt(0).toUpperCase() + c.slice(1)}
            </SelectItem>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 w-36 text-sm"
        >
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all"
                ? "All Statuses"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </Select>
        <span className="text-xs text-[var(--muted-foreground)]">
          {totalVisible} {totalVisible === 1 ? "article" : "articles"}
        </span>
        <div className="ml-auto">
          <AddCoverageDialog onAdd={handleAddArticle} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="text-xs"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {isSorted === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : isSorted === "desc" ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-12 text-[var(--muted-foreground)] text-sm"
                >
                  No articles match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-[var(--muted-foreground)]">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
