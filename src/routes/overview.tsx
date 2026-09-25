import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3 } from "lucide-react";
import { AppHeader, DataSource } from "../components/app-header";
import { rankedInsights } from "../data/price-insights";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "National Price Overview — AgriLink Price Insight" },
      { name: "description", content: "See Rwanda's largest reliable farm-gate and market price gaps using NISR agricultural survey data." },
      { property: "og:title", content: "National Price Overview — AgriLink Price Insight" },
      { property: "og:description", content: "Explore the largest reliable farm-gate and market price gaps across Rwanda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OverviewPage,
});

const topInsights = rankedInsights.filter((record) => record.reliable).slice(0, 10);

function OverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <section className="hero-band grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2 text-primary">
              <BarChart3 className="size-5" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.14em]">National overview</p>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-6xl">
              Where is the price gap widest?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The 10 largest reliable differences between farm-gate and market prices across four key crops.
            </p>
          </div>
          <div className="rounded-lg border border-primary/40 bg-primary-soft p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Data quality</p>
            <p className="mt-3 font-display text-2xl font-extrabold text-foreground">Reliable records only</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Limited-sample findings remain available in the detail view.</p>
          </div>
        </section>

        <section className="pt-9" aria-labelledby="ranking-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Largest reported gaps</p>
              <h2 id="ranking-heading" className="mt-2 font-display text-2xl font-extrabold text-foreground sm:text-3xl">Top 10 findings</h2>
            </div>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">RwF / kg</span>
          </div>

          <ol className="grid gap-3 md:grid-cols-2">
            {topInsights.map((record, index) => (
              <li key={`${record.crop}-${record.district}`}>
                <Link
                  to="/detail"
                  search={{ crop: record.crop, district: record.district }}
                  className="group grid min-h-32 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:grid-cols-[2.75rem_minmax(0,1fr)_auto_1.25rem] sm:p-5"
                >
                  <span className="font-display text-xl font-extrabold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-card-foreground sm:text-lg">{record.crop}</span>
                    <span className="mt-1 block text-sm font-medium text-muted-foreground">{record.district}</span>
                  </span>
                  <span className="shrink-0 rounded-full border border-gap/25 bg-gap-soft px-3 py-2 text-right">
                    <span className="block font-display text-2xl font-extrabold text-gap sm:text-3xl">{record.gapPct.toFixed(1)}%</span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Price gap</span>
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