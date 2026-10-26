import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

import { ALL_DISTRICTS, normalizePhone, validateListing } from "./market";
import { listingBenchmark, priceInsights } from "@/data/price-insights";

describe("normalizePhone", () => {
  it("accepts 07XXXXXXXX", () => expect(normalizePhone("0788123456")).toBe("250788123456"));
  it("accepts 7XXXXXXXX", () => expect(normalizePhone("788123456")).toBe("250788123456"));
  it("accepts 2507XXXXXXXX", () => expect(normalizePhone("250788123456")).toBe("250788123456"));
  it("accepts +2507XXXXXXXX", () => expect(normalizePhone("+250788123456")).toBe("250788123456"));
  it("rejects a non-mobile prefix", () => expect(normalizePhone("0688123456")).toBeNull());
  it("rejects too few digits", () => expect(normalizePhone("078812345")).toBeNull());
  it("rejects another country code", () => expect(normalizePhone("+254788123456")).toBeNull());
});

describe("dataset", () => {
  it("has 114 records", () => expect(priceInsights.length).toBe(114));
  it("lists 30 districts once each, without the typo", () => {
    expect(ALL_DISTRICTS.length).toBe(30);
    expect(ALL_DISTRICTS).not.toContain("Nyarugenege");
  });
});

describe("listing benchmarks", () => {
  it("rounds matched dataset prices to whole RwF/kg", () => {
    expect(listingBenchmark("Banana for beer", "Nyanza")).toEqual({
      farmGatePrice: 104, marketPrice: 204, limitedSample: false,
    });
  });
  it("flags unreliable matching records", () => {
    expect(listingBenchmark("Banana for beer", "Nyamasheke")).toEqual({
      farmGatePrice: 119, marketPrice: 440, limitedSample: true,
    });
  });
  it("does not substitute a different district when there is no match", () => {
    expect(listingBenchmark("Banana for beer", "Unknown district")).toBeNull();
  });
  it("does not substitute a different crop when there is no match", () => {
    expect(listingBenchmark("Unknown crop", "Nyanza")).toBeNull();
  });
});

describe("post form validation", () => {
  const ok = { crop: "Cassava", district: "Bugesera", qty: "500", price: "150", notes: "" };
  it("accepts a valid listing", () => expect(validateListing(ok)).toBeNull());
  it("rejects a crop outside the 4", () => expect(validateListing({ ...ok, crop: "Maize" })).toMatch(/4 crops/));
  it("rejects a district outside the 30", () => expect(validateListing({ ...ok, district: "Nyarugenege" })).toMatch(/30 districts/));
  it("accepts quantity 1 and 1,000,000", () => {
    expect(validateListing({ ...ok, qty: "1" })).toBeNull();
    expect(validateListing({ ...ok, qty: "1000000" })).toBeNull();
  });
  it("rejects quantity 0 and 1,000,001", () => {
    expect(validateListing({ ...ok, qty: "0" })).toMatch(/1,000,000 kg/);
    expect(validateListing({ ...ok, qty: "1000001" })).toMatch(/1,000,000 kg/);
  });
  it("accepts price 1 and 100,000", () => {
    expect(validateListing({ ...ok, price: "1" })).toBeNull();
    expect(validateListing({ ...ok, price: "100000" })).toBeNull();
  });
  it("rejects price 0.5 and 100,001", () => {
    expect(validateListing({ ...ok, price: "0.5" })).toMatch(/100,000 RwF/);
    expect(validateListing({ ...ok, price: "100001" })).toMatch(/100,000 RwF/);
  });
  it("allows 300-character notes and rejects 301", () => {
    expect(validateListing({ ...ok, notes: "a".repeat(300) })).toBeNull();
    expect(validateListing({ ...ok, notes: "a".repeat(301) })).toMatch(/300 characters/);
  });
});
