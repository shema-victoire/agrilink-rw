import { supabase } from "@/integrations/supabase/client";
import { isCrop, priceInsights } from "@/data/price-insights";

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
  is_sample: boolean;
};

export const PHONE_ERROR = "Enter a Rwandan mobile number: 07XXXXXXXX, 7XXXXXXXX, 2507XXXXXXXX or +2507XXXXXXXX.";

/** Returns the number as 2507XXXXXXXX, or null if it is not an accepted format. */
export function normalizePhone(input: string): string | null {
  const v = input.replace(/[\s-]/g, "");
  const m = /^(?:\+?250|0)?(7\d{8})$/.exec(v);
  return m ? `250${m[1]}` : null;
}

export const NOTES_MAX = 300;

/** Returns an error message for the first invalid field, or null when the listing is valid. */
export function validateListing(v: { crop: string; district: string; qty: string; price: string; notes: string }): string | null {
  if (!isCrop(v.crop)) return "Choose one of the 4 crops in the list.";
  if (!ALL_DISTRICTS.includes(v.district)) return "Choose one of the 30 districts in the list.";
  const q = Number(v.qty.trim());
  if (!v.qty.trim() || !Number.isInteger(q) || q < 1 || q > 1_000_000) return "Quantity must be a whole number from 1 to 1,000,000 kg.";
  const p = Number(v.price.trim());
  if (!v.price.trim() || !Number.isFinite(p) || p < 1 || p > 100_000) return "Price must be from 1 to 100,000 RwF/kg.";
  if (v.notes.trim().length > NOTES_MAX) return `Notes must be ${NOTES_MAX} characters or fewer.`;
  return null;
}

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

export async function createListing(input: Omit<Listing, "id" | "status" | "posted_at" | "is_sample">) {
  const { error } = await supabase.from("market_listings").insert({ ...input, status: "active", is_sample: false });
  if (error) throw error;
}

export function sellerBadge(l: Listing) {
  return l.seller_type === "farmer" ? "Farmer · Pickup required" : `Agent · ${l.service_tags[0] ?? "Trade services"}`;
}

export function whatsappLink(l: Listing) {
  const digits = normalizePhone(l.phone) ?? l.phone.replace(/\D/g, "");
  const text = `Hi, I saw your ${l.crop} listing on AgriLink (${l.quantity_kg}kg, RwF ${l.price_expected}/kg in ${l.district}). I'm interested.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
