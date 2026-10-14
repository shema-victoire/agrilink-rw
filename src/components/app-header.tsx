import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="app-header border-b border-header-border bg-surface">
      <div className="mx-auto grid min-h-20 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <Link to="/overview" className="flex min-w-0 items-center gap-3" aria-label="AgriLink Price Insight overview">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary-soft text-primary">
            <Sprout className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-extrabold text-foreground">AgriLink</span>
            <span className="block truncate text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Price Insight</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <nav aria-label="Main" className="flex items-center gap-1 rounded-full border border-header-border bg-header-control p-1">
            <Link to="/overview" className="rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground" activeProps={{ className: "bg-primary-soft text-foreground" }}>
              Insights
            </Link>
            <Link to="/market" className="rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground" activeProps={{ className: "bg-primary-soft text-foreground" }}>
              Market
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function DataSource() {
  return (
    <footer className="mt-10 border-t border-border py-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      Source: NISR Seasonal Agricultural Survey 2025
    </footer>
  );
}
