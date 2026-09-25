import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto grid min-h-20 max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="AgriLink Price Insight home">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sprout className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-xl font-bold text-foreground">AgriLink</span>
            <span className="block truncate text-sm font-semibold text-muted-foreground">Price Insight</span>
          </span>
        </Link>
        <span className="shrink-0 rounded-full border border-primary/20 bg-primary-soft px-3 py-2 text-xs font-bold text-primary">
          NISR data
        </span>
      </div>
    </header>
  );
}

export function DataSource() {
  return (
    <footer className="mt-10 border-t border-border py-6 text-center text-sm font-medium text-muted-foreground">
      Source: NISR Seasonal Agricultural Survey 2025
    </footer>
  );
}
