import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

import { ALL_DISTRICTS, normalizePhone } from "./market";
import { priceInsights } from "@/data/price-insights";

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
