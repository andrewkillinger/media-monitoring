"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings2,
  Database,
  Shield,
  Menu,
  X,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/feed", label: "Coverage Feed", icon: Newspaper },
  { href: "/digest", label: "Daily Digest", icon: FileText },
  { href: "/alerts", label: "Alerts & Flags", icon: AlertTriangle },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

const adminItems = [
  { href: "/rules", label: "Rules & Taxonomy", icon: Settings2 },
  { href: "/sources", label: "Sources", icon: Database },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--sidebar-border)]">
          <Activity className="h-5 w-5 text-[var(--primary)]" />
          <span className="font-semibold text-sm text-[var(--foreground)]">
            Acadia Media Monitor
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-[var(--sidebar-accent)] text-[var(--foreground)]"
                    : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="my-3 mx-3 border-t border-[var(--sidebar-border)]" />
          <div className="space-y-0.5">
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-[var(--sidebar-accent)] text-[var(--foreground)]"
                    : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="px-4 py-3 border-t border-[var(--sidebar-border)] text-xs text-[var(--muted-foreground)]">
          Internal Use Only
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[var(--border)] flex items-center px-4 gap-4 bg-[var(--background)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold text-[var(--foreground)]">
            {[...navItems, ...adminItems].find((i) =>
              pathname.startsWith(i.href)
            )?.label || "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-xs text-white font-medium">
              AC
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--muted)]">
          {children}
        </main>
      </div>
    </div>
  );
}
