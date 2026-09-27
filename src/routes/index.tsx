import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { CROPS, priceInsights } from "../data/price-insights";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriLink Price Insight — NISR Crop Price Analysis" },
      { name: "description", content: "Explore real NISR survey data on farm-gate and market price gaps across Rwanda." },
      { property: "og:title", content: "AgriLink Price Insight — Rwanda Crop Price Gaps" },
      { property: "og:description", content: "Explore real NISR survey data on farm-gate and market price gaps across Rwanda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntroPage,
});

const districtCount = new Set(priceInsights.map((record) => record.district)).size;

const stats = [
  { label: "Records analyzed", value: `${priceInsights.length} crop-district records` },
  { label: "Coverage", value: `${CROPS.length} key crops` },
  { label: "Geography", value: `${districtCount} districts` },
  { label: "Powered by", value: "NISR SAS 2025" },
] as const;

function IntroPage() {
  return (
    <main className="landing-band relative min-h-screen overflow-hidden bg-background px-5 py-8 sm:px-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg border border-primary/40 bg-primary-soft text-primary">
              <Sprout className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold text-foreground">AgriLink</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Price Insight</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section className="landing-hero hero-band flex flex-1 items-center py-14 sm:py-16">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Public agricultural intelligence</p>
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] text-foreground sm:text-7xl">
              Know your crop&rsquo;s real value.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Built on real NISR Seasonal Agricultural Survey data, this tool shows the gap between what farmers earn at the farm-gate and what their crops fetch at market.
            </p>
            <Button asChild size="lg" className="landing-cta mt-9 h-13 rounded-lg px-6 text-base font-bold">
              <Link to="/overview">
                View Price Insight
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <section aria-label="Key figures" className="grid grid-cols-2 gap-3 pb-10 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 sm:p-5"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-display text-lg font-extrabold leading-tight text-foreground sm:text-xl">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <footer className="border-t border-border py-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          NISR Seasonal Agricultural Survey 2025
        </footer>
      </div>
    </main>
  );
}
