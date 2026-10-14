import { supabase } from "@/integrations/supabase/client";
import { priceInsights } from "@/data/price-insights";

export const SERVICE_TAGS = [
  "Delivery included",
  "Packaging included",
  "Can aggregate from multiple farmers",
  "Flexible payment terms",
] as const;

export const ALL_DISTRICTS = [...new Set(priceInsights.map((r) => r.district))].sort((a, b) => a.localeCompare(b));

export type Listing = {
  id: string;
  seller_type: "farmer" | "agent";
  crop: string;
  district: string;
  quantity_kg: number;
  price_expected: number;
  phone: string;
  value_notes: string | null;
  service_tags: string[];
  status: string;
  posted_at: string;
};

export async function fetchListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("market_listings")
    .select("*")
    .eq("status", "active")
    .order("posted_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as Listing[];
}

export async function createListing(input: Omit<Listing, "id" | "status" | "posted_at">) {
  const { error } = await supabase.from("market_listings").insert({ ...input, status: "active" });
  if (error) throw error;
}

export function sellerBadge(l: Listing) {
  return l.seller_type === "farmer" ? "Farmer · Pickup required" : `Agent · ${l.service_tags[0] ?? "Trade services"}`;
}

export function whatsappLink(l: Listing) {
  const digits = l.phone.replace(/\D/g, "");
  const text = `Hi, I saw your ${l.crop} listing on AgriLink (${l.quantity_kg}kg, RwF ${l.price_expected}/kg in ${l.district}). I'm interested.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
