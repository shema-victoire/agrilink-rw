import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Info, TrendingUp } from "lucide-react";
import { AppHeader, DataSource } from "../components/app-header";
import {
  CROPS,
  districtsForCrop,
  findInsight,
  formatPrice,
  isCrop,
  type Crop,
} from "../data/price-insights";

const defaultCrop: Crop = CROPS[0];
const defaultDistrict = districtsForCrop(defaultCrop)[0] ?? "";

export const Route = createFileRoute("/detail")({
  validateSearch: (search: Record<string, unknown>) => {
    const crop = isCrop(search["crop"]) ? search["crop"] : defaultCrop;
    const districts = districtsForCrop(crop);
    const district =
      typeof search["district"] === "string" && districts.includes(search["district"])
        ? search["district"]
        : (districts[0] ?? defaultDistrict);
    return { crop, district };
  },
  head: () => ({
    meta: [
      { title: "Crop & District Detail — AgriLink Price Insight" },
      { name: "description", content: "Compare NISR farm-gate and market prices by crop and district in Rwanda." },
      { property: "og:title", content: "Crop & District Detail — AgriLink Price Insight" },
      { property: "og:description", content: "Compare farm-gate and market prices across Rwanda using NISR agricultural survey data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DetailPage,
});

function DetailPage() {
  const { crop, district } = Route.useSearch();
  const navigate = useNavigate({ from: "/detail" });
  const districts = districtsForCrop(crop);
  const record = findInsight(crop, district);

  if (!record) return null;

  const scaleMax = Math.max(record.farmGatePrice, record.marketPrice);
  const farmWidth = `${Math.max((record.farmGatePrice / scaleMax) * 100, 5)}%`;
  const marketWidth = `${Math.max((record.marketPrice / scaleMax) * 100, 5)}%`;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
        <Link to="/" className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-md px-1 font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <ArrowLeft className="size-5" aria-hidden="true" />
          National overview
        </Link>

        <div className="mb-7">
          <p className="mb-2 text-sm font-bold uppercase text-primary">Price comparison</p>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Crop &amp; district detail</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">Choose a crop and district to compare the prices farmers receive with prices at market.</p>
        </div>

        <section aria-label="Choose crop and district" className="grid gap-4 border-y border-border py-6 sm:grid-cols-2">
          <label className="block text-base font-bold text-foreground">
            Crop
            <select
              value={crop}
              onChange={(event) => {
                const nextCrop = event.target.value as Crop;
                const nextDistrict = districtsForCrop(nextCrop)[0] ?? "";
                void navigate({ search: { crop: nextCrop, district: nextDistrict }, replace: true });
              }}
              className="mt-2 min-h-13 w-full rounded-md border border-input bg-surface px-4 text-base font-semibold text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-ring/20"
            >
              {CROPS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-base font-bold text-foreground">
            District
            <select
              value={district}
              onChange={(event) => void navigate({ search: { crop, district: event.target.value }, replace: true })}
              className="mt-2 min-h-13 w-full rounded-md border border-input bg-surface px-4 text-base font-semibold text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-ring/20"
            >
              {districts.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </section>

        <section className="py-8" aria-labelledby="comparison-heading">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase text-muted-foreground">{record.district}</p>
              <h2 id="comparison-heading" className="mt-1 font-display text-2xl font-bold text-foreground">{record.crop}</h2>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-muted-foreground">Price gap</p>
              <p className="font-display text-4xl font-bold text-gap sm:text-5xl">{record.gapPct.toFixed(1)}%</p>
            </div>
          </div>

          <div className="mt-8 space-y-7" aria-label="Farm-gate and market price bars">
            <PriceBar label="Farm-gate price" value={record.farmGatePrice} width={farmWidth} variant="farm" />
            <PriceBar label="Market price" value={record.marketPrice} width={marketWidth} variant="market" />
          </div>

          <div className="mt-8 border-l-4 border-gap bg-gap-soft px-5 py-5">
            <div className="flex gap-3">
              <TrendingUp className="mt-0.5 size-6 shrink-0 text-gap" aria-hidden="true" />
              <p className="text-lg font-bold leading-relaxed text-foreground">
                Farmers selling {record.crop.toLowerCase()} at the farm-gate in {record.district} earn <span className="text-gap">{record.gapPct.toFixed(1)}% less</span> than at market.
              </p>
            </div>
          </div>

          {!record.reliable && (
            <p className="mt-5 flex items-start gap-2 text-sm font-medium text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Based on a limited sample — treat as directional.
            </p>
          )}
        </section>
        <DataSource />
      </main>
    </div>
  );
}

function PriceBar({ label, value, width, variant }: { label: string; value: number; width: string; variant: "farm" | "market" }) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
        <span className="truncate font-bold text-foreground">{label}</span>
        <span className="shrink-0 text-lg font-bold text-foreground">RwF {formatPrice(value)}<span className="text-sm font-medium text-muted-foreground">/kg</span></span>
      </div>
      <div className="h-5 overflow-hidden rounded-sm bg-muted" role="img" aria-label={`${label}: ${formatPrice(value)} Rwandan francs per kilogram`}>
        <div className={`h-full rounded-sm ${variant === "farm" ? "bg-farm" : "bg-market"}`} style={{ width }} />
      </div>
    </div>
  );
}
