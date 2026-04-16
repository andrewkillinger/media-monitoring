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
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { demoArticles, type DemoArticle } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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

const columnHelper = createColumnHelper<DemoArticle>();

const columns = [
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
      <span className="text-xs font-medium whitespace-nowrap">{info.getValue()}</span>
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
    size: 380,
  }),
  columnHelper.accessor("section", {
    header: "Section",
    cell: (info) => (
      <span className="text-xs text-[var(--muted-foreground)]">{info.getValue()}</span>
    ),
    size: 160,
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) => (
      <span className={cn("text-sm tabular-nums", priorityColor(info.getValue()))}>
        {info.getValue()}
      </span>
    ),
    size: 70,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    size: 100,
  }),
];

export default function FeedPage() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    return demoArticles.filter((a) => {
      if (channelFilter !== "all" && a.channel !== channelFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  }, [channelFilter, statusFilter]);

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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const channels = ["all", "online", "social", "print", "broadcast", "wire"];
  const statuses = ["all", "published", "reviewed", "classified", "excluded"];

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search headlines, outlets..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-64 text-sm"
        />
        <Select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="h-9 w-36 text-sm"
        >
          {channels.map((c) => (
            <SelectItem key={c} value={c}>
              {c === "all" ? "All Channels" : c.charAt(0).toUpperCase() + c.slice(1)}
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
              {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </Select>
        <span className="text-xs text-[var(--muted-foreground)] ml-auto">
          {table.getFilteredRowModel().rows.length} articles
        </span>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="text-xs"
                    >
                      {header.isPlaceholder ? null : (
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          {table.getPageCount()}
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
