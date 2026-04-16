"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Newspaper,
  BarChart3,
  ListFilter,
  Settings2,
  Rss,
  Shield,
  Menu,
  X,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/today", label: "Today's News", icon: Newspaper },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/feed", label: "Feed", icon: ListFilter },
];

const adminItems = [
  { href: "/rules", label: "Rules & Taxonomy", icon: Settings2 },
  { href: "/sources", label: "Sources & Ingestion", icon: Rss },
  { href: "/admin", label: "Administration", icon: Shield },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-1 bg-[var(--accent)] flex-shrink-0" />

        <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--sidebar-border)]">
          <Globe className="h-5 w-5 text-[var(--accent)]" />
          <span className="font-semibold text-sm text-white">
            Media Monitor
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 text-[var(--sidebar-foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--sidebar-accent)] text-white"
                      : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="my-3 mx-3 border-t border-[var(--sidebar-border)]" />

          <div className="space-y-0.5">
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--sidebar-accent)] text-white"
                      : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[var(--border)] flex items-center px-4 gap-4 bg-[var(--background)]">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold text-[var(--foreground)]">
            {[...navItems, ...adminItems].find((i) =>
              pathname.startsWith(i.href)
            )?.label || "Today's News"}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--muted)]">
          {children}
        </main>
      </div>
    </div>
  );
}
