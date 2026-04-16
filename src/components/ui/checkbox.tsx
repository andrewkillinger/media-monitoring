"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false
    );

    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalChecked(e.target.checked);
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "flex h-4 w-4 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border border-[var(--primary)] ring-offset-[var(--background)] transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            isChecked
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background)]",
            className
          )}
          aria-hidden="true"
        >
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
