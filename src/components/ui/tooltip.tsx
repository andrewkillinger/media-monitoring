"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue>({
  open: false,
  setOpen: () => {},
});

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

function TooltipTrigger({
  children,
  className,
  ...props
}: TooltipTriggerProps) {
  const { setOpen } = React.useContext(TooltipContext);
  return (
    <div
      className={cn("inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

function TooltipContent({
  children,
  className,
  side = "top",
  sideOffset = 4,
  ...props
}: TooltipContentProps) {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  const positionStyles: React.CSSProperties =
    side === "top"
      ? { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: sideOffset }
      : side === "bottom"
      ? { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: sideOffset }
      : side === "left"
      ? { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: sideOffset }
      : { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: sideOffset };

  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--foreground)] px-3 py-1.5 text-xs text-[var(--background)] shadow-md whitespace-nowrap",
        className
      )}
      style={positionStyles}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
