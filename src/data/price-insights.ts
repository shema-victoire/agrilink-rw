import records from "./price-insights.json";

export const CROPS = [
  "Banana for beer",
  "Dessert banana",
  "Cooking banana",
  "Cassava",
] as const;

export type Crop = (typeof CROPS)[number];

export type PriceInsight = {
  crop: Crop;
  district: string;
  farmGatePrice: number;
  marketPrice: number;
  gapPct: number;
  reliable: boolean;
  farmGateSamples: number;
  marketSamples: number;
};

export const priceInsights = records as PriceInsight[];

export const rankedInsights = [...priceInsights].sort(
  (a, b) => b.gapPct - a.gapPct,
);

export function districtsForCrop(crop: Crop) {
  return priceInsights
    .filter((record) => record.crop === crop)
    .map((record) => record.district)
    .sort((a, b) => a.localeCompare(b));
}

export function findInsight(crop: Crop, district: string) {
  return priceInsights.find(
    (record) => record.crop === crop && record.district === district,
  );
}

export function isCrop(value: unknown): value is Crop {
  return typeof value === "string" && CROPS.includes(value as Crop);
}

export function listingBenchmark(crop: string, district: string) {
  const record = isCrop(crop) ? findInsight(crop, district) : undefined;
  if (!record) return null;
  return {
    farmGatePrice: Math.round(record.farmGatePrice),
    marketPrice: Math.round(record.marketPrice),
    limitedSample: !record.reliable,
  };
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-RW", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value);
}
