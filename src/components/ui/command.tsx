"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
}

const CommandContext = React.createContext<CommandContextValue>({
  search: "",
  setSearch: () => {},
});

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

function Command({ className, children, ...props }: CommandProps) {
  const [search, setSearch] = React.useState("");

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => {
    const { search, setSearch } = React.useContext(CommandContext);

    return (
      <div className="flex items-center border-b border-[var(--border)] px-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 shrink-0 text-[var(--muted-foreground)]"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full bg-transparent py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

function CommandList({ className, children, ...props }: CommandListProps) {
  return (
    <div
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
      role="listbox"
      {...props}
    >
      {children}
    </div>
  );
}

interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

function CommandEmpty({ className, children, ...props }: CommandEmptyProps) {
  return (
    <div
      className={cn(
        "py-6 text-center text-sm text-[var(--muted-foreground)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: CommandGroupProps) {
  return (
    <div
      className={cn("overflow-hidden p-1 text-[var(--foreground)]", className)}
      role="group"
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

interface CommandItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

function CommandItem({
  className,
  children,
  value = "",
  disabled = false,
  onSelect,
  ...props
}: CommandItemProps) {
  const { search } = React.useContext(CommandContext);

  // Filter items based on search
  const itemText =
    typeof children === "string"
      ? children
      : value;

  if (
    search &&
    !itemText.toLowerCase().includes(search.toLowerCase())
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-[var(--radius-sm)] px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] aria-selected:bg-[var(--accent)] aria-selected:text-[var(--accent-foreground)]",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      role="option"
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect?.(value)}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("-mx-1 h-px border-[var(--border)]", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
};
