import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Info } from "lucide-react";
import { AppHeader, DataSource } from "../components/app-header";
import { rankedInsights } from "../data/price-insights";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriLink Price Insight — Rwanda Crop Price Gaps" },
      { name: "description", content: "See where farm-gate and market prices differ most using NISR agricultural survey data." },
      { property: "og:title", content: "AgriLink Price Insight — Rwanda Crop Price Gaps" },
      { property: "og:description", content: "Compare farm-gate and market prices across Rwanda using NISR agricultural survey data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OverviewPage,
});

// Only records with enough samples on both sides are ranked.
const topInsights = rankedInsights.filter((r) => r.reliable).slice(0, 10);

function OverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6 sm:py-12">
            <div className="flex max-w-3xl items-start gap-4">
              <BarChart3 className="mt-1 hidden size-10 shrink-0 sm:block" aria-hidden="true" />
              <div>
                <p className="mb-2 text-sm font-bold uppercase text-primary-foreground/75">National overview</p>
                <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">Where is the price gap widest?</h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-foreground/85">The 10 largest differences between farm-gate and market prices across four key crops. Limited-sample records are excluded from this ranking.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10" aria-labelledby="ranking-heading">
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase text-primary">Largest reported gaps</p>
              <h2 id="ranking-heading" className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">Top 10 findings</h2>
            </div>
            <span className="shrink-0 text-sm font-semibold text-muted-foreground">RwF / kg</span>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {topInsights.map((record, index) => (
              <li key={`${record.crop}-${record.district}`}>
                <Link
                  to="/detail"
                  search={{ crop: record.crop, district: record.district }}
                  className="group grid min-h-24 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:grid-cols-[3rem_minmax(0,1fr)_9rem_2rem] sm:px-3"
                >
                  <span className="font-display text-xl font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-lg font-bold text-foreground">{record.crop}</span>
                    <span className="mt-1 block truncate font-medium text-muted-foreground">{record.district}</span>
                    {!record.reliable && <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Info className="size-3.5" aria-hidden="true" /> Limited sample</span>}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-display text-3xl font-bold text-gap">{record.gapPct.toFixed(1)}%</span>
                    <span className="text-xs font-bold uppercase text-muted-foreground">price gap</span>
                  </span>
                  <ArrowRight className="hidden size-5 text-primary transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
          <DataSource />
        </section>
      </main>
    </div>
  );
}